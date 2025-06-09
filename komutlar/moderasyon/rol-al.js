const { PermissionFlagsBits } = require("discord.js");

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return await message.reply("Bu komutu kullanmak için `Rolleri Yönet` yetkiniz olmalı.");
    }
    const rol = message.mentions.roles.first();
    if (!rol) return await message.reply("Lütfen bir rol etiketleyin. Örnek: `!rolal @Rol @Kullanıcı1 @Kullanıcı2`");

    const üyeler = message.mentions.members.filter(m => m.id !== message.guild.id && !m.user.bot);
    if (!üyeler.size) return await message.reply("Lütfen en az bir kullanıcı etiketleyin.");
    let başarı = 0;
    for (const [_, üye] of üyeler) {
        try {
            await üye.roles.remove(rol);
            başarı++;
        } catch (err) {
            console.error(`Rol alınamadı: ${üye.user.tag}`);
        }
    }
    return await message.reply(`${başarı} kullanıcıdan başarıyla \`${rol.name}\` rolü alındı.`);
};

exports.conf = {
    aliases: ["rolal"]
};

exports.help = {
    name: "rol-al",
    description: "Seçilen bir rolü kullanıcıdan alır.",
    kategori: "moderasyon"
};
