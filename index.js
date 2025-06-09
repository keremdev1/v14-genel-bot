const { Client, GatewayIntentBits, Partials, ButtonBuilder, ButtonComponent, ButtonStyle, ActionRowBuilder, PermissionsFlags, ModalBuilder, TextInputBuilder, TextInputStyle, Collection, AttachmentBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const fs = require("fs")
const ayarlar = require("./ayarlar.js");
const { prefix, color, sunucu, statu, durum } = require("./ayarlar.js")
const db = require("croxydb")
const Discord = require("discord.js")
const canvafy = require("canvafy");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ],
});

module.exports = client;

const { error } = require("console");

client.login(ayarlar.token)


client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    let command = message.content.toLocaleLowerCase().split(" ")[0].slice(prefix.length);
    let params = message.content.split(" ").slice(1);
    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
        cmd.run(client, message, params)
    }
});

client.commands = new Collection();
client.aliases = new Collection();

client.on('ready', () => {
    client.user.setStatus(statu)
    client.user.setActivity(durum)
    console.log(`Prefix: ${ayarlar.prefix}`);
    console.log(`Bot Aktif!`);
});

fs.readdir("./komutlar/GENEL", (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./komutlar/GENEL/${f}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
})

fs.readdir("./komutlar/eglence", (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./komutlar/eglence/${f}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
})

fs.readdir("./komutlar/moderasyon", (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./komutlar/moderasyon/${f}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
})

fs.readdir("./komutlar/sistem", (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./komutlar/sistem/${f}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
})

////////////////////////////////////////// MAİN COMMANDS ////////////////////////////////////////////

///////////////////////////////////////// YARDIM MENÜSÜ ////////////////////////////////////////////

client.on("interactionCreate", async i => {
    if (i.isStringSelectMenu() && i.customId === "yardım_menu") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply("Bu Menüyü Sadece Komutu Çağıran Kullanabilir!")
        }
        const menu_secim = i.values[0];
        const Komutlar = client.commands.filter(cmd => cmd.help.kategori === menu_secim);
        const komutlarListesi = Komutlar.size > 0
            ? Komutlar.map(cmd => `:white_small_square: [**${prefix}${cmd.help.name}**](https://discord.gg/) **→** ${cmd.help.description}`).join("\n ")
            : "Bu kategoriye ait komut bulunamadı.";
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username} - Yardım`, iconURL: client.user.avatarURL() })
            .setDescription(komutlarListesi)
            .setColor(color)
            .setFooter({ text: `Sorgulayan ${i.user.username}`, iconURL: i.user.avatarURL() });

        i.update({ embeds: [embed] });
    }
});

///////////////////////////////////////// WELCOME SİSTEMİ ////////////////////////////////////////////

client.on("interactionCreate", async i => {
    if(i.isChannelSelectMenu() && i.customId === "welcome_kanal") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply("Bu Menüyü Sadece Komutu Çağıran Kullanabilir!")
        }
        const secim = i.values[0]
        await db.set(`${i.guild.id}_welcome.kanal`, secim)

        const dbkey = await db.get(`${i.guild.id}_welcome`)
        const { kanal, rol } = dbkey || {};
        const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username} - Welcome Sistemi`, iconURL: client.user.displayAvatarURL() })
        .setFields(
            { name: `Welcome Kanalı` , value: `Bu Menüden Welcome (Giriş Çıkış) Kanalını Ayarlarsınız. (${kanal ? `<#${kanal}>` : `**Kanal Ayarlanmamış**`})` },
            { name: `Welcome Rolü` , value: `Bu Menüden Welcome (Giriş Çıkış) Rolünü Ayarlarsınız. (${rol ? `<@&${rol}>` : `**Kanal Ayarlanmamış**`})` },
        )
        .setColor(color)
        .setFooter({ text: `Sorgulayan ${i.user.globalName}`, iconURL: i.user.avatarURL() });

        const kanal_menu = new ChannelSelectMenuBuilder()
        .setChannelTypes(ChannelType.AnnouncementThread, ChannelType.GuildText)
        .setCustomId("welcome_kanal")
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Welcome Kanalı")
        if(kanal) kanal_menu.setDefaultChannels(kanal)
        
        const rol_menu = new RoleSelectMenuBuilder()
        .setCustomId("welcome_rol")
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Welcome Rolü")
        if(rol) rol_menu.setDefaultRoles(rol)
        
        const kanal_row = new ActionRowBuilder().setComponents(kanal_menu)
        const rol_row = new ActionRowBuilder().setComponents(rol_menu)
        
        i.update({ embeds: [embed], components: [kanal_row, rol_row ] })
    }

        if(i.isRoleSelectMenu() && i.customId === "welcome_rol") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply("Bu Menüyü Sadece Komutu Çağıran Kullanabilir!")
        }
        const secim = i.values[0]
        const bot = await i.guild.members.fetch(client.user.id);
        const secim_rol = i.guild.roles.cache.get(secim);
        if (secim_rol.position >= bot.roles.highest.position) {
            return await i.reply({ content: `Bu rol botun rolünden yüksek olduğu için verilemez!`, ephemeral: true });
        }

        await db.set(`${i.guild.id}_welcome.rol`, secim)

        const dbkey = await db.get(`${i.guild.id}_welcome`)
        const { kanal, rol } = dbkey || {};
        const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username} - Welcome Sistemi`, iconURL: client.user.displayAvatarURL() })
        .setFields(
            { name: `Welcome Kanalı` , value: `Bu Menüden Welcome (Giriş Çıkış) Kanalını Ayarlarsınız. (${kanal ? `<#${kanal}>` : `**Kanal Ayarlanmamış**`})` },
            { name: `Welcome Rolü` , value: `Bu Menüden Welcome (Giriş Çıkış) Rolünü Ayarlarsınız. (${rol ? `<@&${rol}>` : `**Kanal Ayarlanmamış**`})` },
        )
        .setColor(color)
        .setFooter({ text: `Sorgulayan ${i.user.globalName}`, iconURL: i.user.avatarURL() });

        const kanal_menu = new ChannelSelectMenuBuilder()
        .setChannelTypes(ChannelType.AnnouncementThread, ChannelType.GuildText)
        .setCustomId("welcome_kanal")
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Welcome Kanalı")
        if(kanal) kanal_menu.setDefaultChannels(kanal)
        
        const rol_menu = new RoleSelectMenuBuilder()
        .setCustomId("welcome_rol")
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Welcome Rolü")
        if(rol) rol_menu.setDefaultRoles(rol)
        
        const kanal_row = new ActionRowBuilder().setComponents(kanal_menu)
        const rol_row = new ActionRowBuilder().setComponents(rol_menu)
        
        i.update({ embeds: [embed], components: [kanal_row, rol_row ] })
    }
})

client.on('guildMemberAdd', async member => {
  const dbkey = await db.get(`${member.guild.id}_welcome`);
  const { kanal, rol } = dbkey || {};
  if (!kanal && !rol) return;
  const kanal2 = await member.guild.channels.fetch(kanal);
  const welcome = await new canvafy.WelcomeLeave()
    .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
    .setTitle(`Hoş Geldin!`)
    .setDescription(`Senin ile beraber ${member.guild.memberCount} kişi olduk!`)
    .setBorder("#57F287")
    .setAvatarBorder("#57F287")
    .build();
  await member.roles.add(rol);
  if (kanal2) {
    await kanal2.send({
      content: `:inbox_tray: ${member} sunucumuza **katıldı!** Sunucumuz **${member.guild.memberCount}** kişi oldu!`,
      files: [{ attachment: welcome, name: `welcome-${member.id}.png` }],
    });
  }
});

client.on("guildMemberRemove", async member => {
  const dbkey = await db.get(`${member.guild.id}_welcome`);
  const { kanal, rol } = dbkey || {};
  if (!kanal) return;
  const kanal2 = await member.guild.channels.fetch(kanal);
  const welcome = await new canvafy.WelcomeLeave()
    .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
    .setTitle(`Görüşürüz!`)
    .setDescription(`Sen Gidince ${member.guild.memberCount} Kişi Kaldık!`)
    .setBorder("#ED4245")
    .setAvatarBorder("#ED4245")
    .build();
  if (kanal2) {
    await kanal2.send({
      content: `:outbox_tray: ${member} Sunucumuzdan **Ayrıldı!** Sunucumuz **${member.guild.memberCount}** Kişi Kaldık!`,
      files: [{ attachment: welcome, name: `welcome-${member.id}.png` }],
    });
  }
});

///////////////////////////////////////// İNVİTE LOG SİSTEMİ ////////////////////////////////////////////

const davetler = new Map();

client.on('ready', async () => {
    const guild = await client.guilds.fetch(sunucu)
      const guildInvites = await guild.invites.fetch();
      davetler.set(guild.id, guildInvites);
      davetler.set(guild.id, new Map());
});

client.on('guildMemberAdd', async (member) => {
  const dbkey = await db.get(`${member.guild.id}_invite`);
  const { kanal } = dbkey || {};
  if (!kanal) return;

  try {
    const onceki = davetler.get(member.guild.id);
    const yeni = await member.guild.invites.fetch();

    if (!onceki || typeof onceki.get !== "function") {
      davetler.set(member.guild.id, yeni);
      return;
    }

    const kullanilan = yeni.find(i => {
      const oncekiKullanim = onceki.get(i.code)?.uses || 0;
      return i.uses > oncekiKullanim;
    });

    davetler.set(member.guild.id, yeni);
    if (!kullanilan) return;

    const eden = kullanilan.inviter;
    if (!eden) return;

    const kanal2 = await member.guild.channels.fetch(kanal).catch(() => null);
    if (!kanal2) return;

    kanal2.send(`${member} kullanıcısı, **\`${eden.tag}\`** tarafından davet edildi. Toplam kullanım: **${kullanilan.uses}**`);
  } catch (err) {
    console.error("Invite Log hata:", err);
  }
});


client.on("interactionCreate", async i => {
    if(i.isChannelSelectMenu() && i.customId === "invite_kanal") {
        if(i.message.mentions.members.first().id !== i.member.id) {
            return await i.reply("Bu Menüyü Sadece Komutu Çağıran Kullanabilir!")
        }
    await db.set(`${i.guild.id}_invite.kanal`, i.values[0] )
    
    const dbkey = await db.get(`${i.guild.id}_invite`)
    const { kanal } = dbkey || {};
    const embed = new EmbedBuilder()
    .setAuthor({ name: `${client.user.username} - İnvite Sistemi`, iconURL: client.user.displayAvatarURL() })
    .setFields(
        { name: `İnvite Kanalı` , value: `Bu Menüden İnvite (Davet) Kanalını Ayarlarsınız. (${kanal ? `<#${kanal}>` : `**Kanal Ayarlanmamış**`})` },
    )
    .setColor(color)
    .setFooter({ text: `Sorgulayan ${i.user.globalName}`, iconURL: i.user.avatarURL() });

    const kanal_menu = new ChannelSelectMenuBuilder()
    .setChannelTypes(ChannelType.AnnouncementThread, ChannelType.GuildText)
    .setCustomId("invite_kanal")
    .setMaxValues(1)
    .setMinValues(1)
    .setPlaceholder("İnvite Kanalı")
    if(kanal) kanal_menu.setDefaultChannels(kanal)
    
    const kanal_row = new ActionRowBuilder().setComponents(kanal_menu)
    i.update({ embeds: [embed], components: [kanal_row] })
    }
})
