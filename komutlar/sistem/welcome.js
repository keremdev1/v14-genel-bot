const { EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js")
const { prefix, color } = require("../../ayarlar.js")
const db = require("croxydb")
const { ChannelSelectMenuBuilder } = require("@discordjs/builders")
const { RoleSelectMenuBuilder } = require("@discordjs/builders")
const { ActionRowBuilder } = require("@discordjs/builders")
exports.run = async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await message.reply("Bu komutu kullanmak için `Yönetici` yetkiniz olmalı.");
    }
    const dbkey = await db.get(`${message.guild.id}_welcome`)
    const { kanal, rol } = dbkey || {};
    const embed = new EmbedBuilder()
    .setAuthor({ name: `${client.user.username} - Welcome Sistemi`, iconURL: client.user.avatarURL() })
    .setFields(
        { name: `Welcome Kanalı` , value: `Bu Menüden Welcome (Giriş Çıkış) Kanalını Ayarlarsınız. (${kanal ? `<#${kanal}>` : `**Kanal Ayarlanmamış**`})` },
        { name: `Welcome Rolü` , value: `Bu Menüden Welcome (Giriş Çıkış) Rolünü Ayarlarsınız. (${rol ? `<@&${rol}>` : `**Kanal Ayarlanmamış**`})` },
    )
    .setColor(color)
    .setFooter({ text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() });

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

    await message.reply({ embeds: [embed], components: [kanal_row, rol_row ] })
}
exports.conf = {
    aliases: ["welcome", "giriş-çıkış"]
}
exports.help = {
    name: 'giriş-çıkış',
    description: 'Welcome Sisteminin Ayarlarını Yaparsınız',
    kategori: "sistem"
};