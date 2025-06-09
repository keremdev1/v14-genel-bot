const { PermissionFlagsBits } = require("discord.js");
const { prefix } = require("../../ayarlar.js");

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return await message.reply("Bu komutu kullanmak için `Üyeleri Yasakla` yetkiniz olmalı!");
    }
    const üyeID = args[0];
    if (!üyeID || isNaN(üyeID)) {
        return await message.reply(`Yanlış kullanım: \`${prefix}forceban <id> <sebep>\`\nEksik Bilgi: Kullanıcı ID`);
    }
    const sebep = args.slice(1).join(" ");
    if (!sebep) {
        return await message.reply(`Yanlış kullanım: \`${prefix}forceban <id> <sebep>\`\nEksik Bilgi: Sebep`);
    }
    try {
        await message.guild.members.ban(üyeID, { reason: `Yetkili ${message.author.tag} - ${sebep}` });
        await message.reply("Kullanıcı başarıyla sunucudan yasaklandı.");
    } catch (err) {
        await message.reply("Kullanıcı banlanırken bir hata oluştu. ID doğru mu, botun yetkisi yeterli mi?");
    }
};

exports.conf = {
    aliases: ["gizli-yasaklama"]
};

exports.help = {
    name: "forceban",
    description: "Belirtilen ID'deki kullanıcıyı sunucuda olmasa bile yasaklar.",
    kategori: "moderasyon"
};
