const { PermissionFlagsBits } = require("discord.js");

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return await message.reply("Bu komutu kullanmak için `Mesajları Yönet` yetkiniz olmalı.");
    }
    const sayı = parseInt(args[0]);

    if (!sayı || isNaN(sayı) || sayı < 1 || sayı > 99) {
        return await message.reply("Lütfen 1 ile 99 arasında bir sayı girin.");
    }
    try {
        const silinecek = await message.channel.messages.fetch({ limit: sayı });
        await message.channel.bulkDelete(silinecek, true);
        const yanıt = await message.channel.send(`${silinecek.size} mesaj başarıyla silindi.`);
        setTimeout(() => yanıt.delete().catch(() => {}), 5000);
    } catch (err) {
        console.error(err);
        await message.reply("Mesajlar silinirken bir hata oluştu. 14 günden eski mesajlar silinemez.");
    }
};

exports.conf = {
    aliases: ["temizle", "clear"]
};

exports.help = {
    name: "sil",
    description: "Belirtilen sayı kadar mesajı siler.",
    kategori: "moderasyon"
};
