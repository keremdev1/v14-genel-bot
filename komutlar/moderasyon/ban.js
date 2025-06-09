const { PermissionFlagsBits } = require("discord.js")
const { prefix,  } = require("../../ayarlar.js")

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return await message.reply("Bu komutu kullanmak için `Üyeleri Yasakla` yetkiniz olmalı!");
    }
    const üye = message.mentions.members.first()
    if(!üye) {
        return await message.reply(`Yanlış Kullanım \`${prefix}ban @üye sebep\` Eskis Bilgi: @Üye`)
    }
    const sebep = args.slice(1).join(' ');
    if(!sebep) {
        return await message.reply(`Yanlış Kullanım \`${prefix}ban @üye sebep\` Eskis Bilgi: Sebep`)
    }
    await üye.ban({ reason: `yetkili ${message.author.username} : ${sebep}` })
    await message.reply(`Üye Başarılı Bir Şekilde Sunucudan Yasaklandı`)
}
exports.conf = {
    aliases: ["yasakla"]
}
exports.help = {
    name: 'ban',
    description: 'Belirtilen Üyeyi Yasaklarsınız (Ban)',
    kategori: "modeasyon"
};