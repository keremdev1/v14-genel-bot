const { PermissionFlagsBits } = require("discord.js");

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return await message.reply("Bu komutu kullanmak için `Rolleri Yönet` yetkiniz olmalı.");
    }
    const rol = message.mentions.roles.first();
    if (!rol) return await message.reply("Lütfen bir rol etiketleyin. Örnek: `!rolver @Rol @Kullanıcı1 @Kullanıcı2`");
    if (rol.position >= bot.roles.highest.position) {
         return await message.reply(`Bu rol botun rolünden yüksek olduğu için verilemez!`);
    }
    const üyeler = message.mentions.members.filter(m => m.id !== message.guild.id && !m.user.bot);
    if (!üyeler.size) return await message.reply("Lütfen en az bir kullanıcı etiketleyin.");
    let başarı = 0;
    for (const [_, üye] of üyeler) {
        try {
            await üye.roles.add(rol);
            başarı++;
        } catch (err) {
            console.error(`Rol verilemedi: ${üye.user.tag}`);
        }
    }
    return await message.reply(`${başarı} kullanıcıya başarıyla \`${rol.name}\` rolü verildi.`);
};

exports.conf = {
    aliases: ["rolver"]
};

exports.help = {
    name: "rol-ver",
    description: "Seçilen bir rolü kullanıcıya verir.",
    kategori: "moderasyon"
};
