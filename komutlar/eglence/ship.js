const { EmbedBuilder } = require("discord.js");
const { prefix, color } = require("../../ayarlar.js");
const db = require("croxydb");
const canvafy = require("canvafy");
const fs = require("fs");
const path = require("path");

exports.run = async (client, message, args) => {
  const kullanıcı = message.mentions.members.first() || message.guild.members.cache.filter(member => !member.user.bot).random();
  if (!kullanıcı) return message.reply("Lütfen bir kullanıcı etiketle.");

  const randomSayi = Math.floor(Math.random() * 100) + 1;
  try {

    const ship = fs.readFileSync(path.join(__dirname, "../../resimler/ship.png"));
    const shipkart = await new canvafy.Ship()
      .setAvatars(
        message.member.user.displayAvatarURL({ forceStatic: true, extension: "png" }),
        kullanıcı.user.displayAvatarURL({ forceStatic: true, extension: "png" })
      )
      .setBackground("image", ship)
      .setBorder("#f0f0f0")
      .setOverlayOpacity(0.5)
      .setCustomNumber(`${randomSayi}`)
      .build();

    await message.reply({
      files: [{ attachment: shipkart, name: "shipkart.png" }],
      content: `> **${message.member.user.username} :heart: ${kullanıcı.user.username} - %${randomSayi} Uyum**`
    });
  } catch (err) {
    console.error(err);
    message.reply("Bir hata oluştu.");
  }
};

exports.conf = {
  aliases: []
};
exports.help = {
  name: "ship",
  description: "Kullanıcı ile uyum oranınızı gösterir",
  kategori: "eglence"
};
