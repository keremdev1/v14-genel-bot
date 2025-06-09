const { EmbedBuilder, PermissionFlagsBits } = require("discord.js")
const { prefix, color } = require("../../ayarlar.js")
const db = require("croxydb")
exports.run = async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return await message.reply("Bu komutu kullanmak için `Kanalları Düzenle` yetkiniz olmalı!");
    }
    const kanal = message.channel;
    try {
        const yeniKanal = await kanal.clone();
        await kanal.delete();
        yeniKanal.send("Bu kanal nuke'lendi, temiz bir başlangıç yapıldı!");
    } catch (error) {
        console.error(error);
        message.reply("Kanal nuke'lenirken bir hata oluştu.");
    }
}
exports.conf = {
    aliases: ["sıfırla"]
}
exports.help = {
    name: 'nuke',
    description: 'Kanalı Yeinden Oluşturur',
    kategori: "moderasyon"
};