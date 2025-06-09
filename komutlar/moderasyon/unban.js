const { PermissionFlagsBits } = require("discord.js")
const { prefix } = require("../../ayarlar.js")

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return await message.reply("Bu komutu kullanmak için `Üyeleri Yasakla` yetkiniz olmalı!");
    }
    const üyeID = args[0];
    if (!üyeID || isNaN(üyeID)) {
        return await message.reply(`Yanlış kullanım: \`${prefix}unban <id>\`\nEksik Bilgi: Kullanıcı ID`);
    }
    try {
        await message.guild.bans.remove(üyeID);
        await message.reply("Kullanıcının Yasağı Kaldırıldı");
    } catch (err) {
        await message.reply("Kullanıcı Yasağı Kaldırılırken Bir Hata Oluştu");
    }
}
exports.conf = {
    aliases: ["yasak-kaldır"]
}
exports.help = {
    name: 'unban',
    description: 'Belirtilen Üyenin Yasağını Kaldırır',
    kategori: "moderasyon"
};