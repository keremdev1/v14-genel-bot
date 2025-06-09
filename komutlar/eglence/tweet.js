const { EmbedBuilder } = require("discord.js");
const { prefix, color } = require("../../ayarlar.js");
const db = require("croxydb");
const canvafy = require("canvafy");
const fs = require("fs");
const path = require("path");

exports.run = async (client, message, args) => {
  if (args.length < 1) {
    return message.reply(`Kullanım örneği:\n${prefix}tweet <@üye|rte|bahçeli|kemal> <metin> veya ${prefix}tweet <metin>`);
  }

  const presets = {
    rte: {
      displayName: 'Recep Tayyip Erdoğan',
      username: 'RTE',
      avatar: fs.readFileSync(path.join(__dirname, "../../resimler/rte.png"))
    },
    bahçeli: {
      displayName: 'Devlet Bahçeli',
      username: 'Bahceli',
      avatar: fs.readFileSync(path.join(__dirname, "../../resimler/bahceli.png"))
    },
    kemal: {
      displayName: 'Kemal Kılıçdaroğlu',
      username: 'Kemal',
      avatar: fs.readFileSync(path.join(__dirname, "../../resimler/kemal.png"))
    }
  };

  let userData;
  let text;

  const mention = message.mentions.users.first();

if (mention) {
  text = args.slice(1).join(' ');
  if (!text) return message.reply('Lütfen tweet için bir metin yazınız.');
  userData = {
    displayName: mention.globalName || mention.username,
    username: mention.username.toLowerCase(),
    avatar: mention.displayAvatarURL({ format: 'png', size: 1024 })
  };
} else if (args.length > 1 && presets[args[0].toLowerCase()]) {
  userData = presets[args[0].toLowerCase()];
  text = args.slice(1).join(' ');
  if (!text) return message.reply('Lütfen tweet için bir metin yazınız.');
} else {
  text = args.join(' ');
  userData = {
    displayName: message.author.globalName || message.author.username,
    username: message.author.username.toLowerCase(),
    avatar: message.author.displayAvatarURL({ format: 'png', size: 1024 })
  };
}

  try {
    const tweet = await new canvafy.Tweet()
      .setTheme('dim')
      .setUser({ displayName: userData.displayName, username: userData.username })
      .setVerified(true)
      .setComment(text)
      .setAvatar(userData.avatar)
      .build();

    message.reply({
      files: [{
        attachment: tweet,
        name: `tweet-${message.author.id}.png`
      }]
    });
    message.delete()
  } catch (error) {
    console.error(error);
    message.reply('Tweet oluşturulurken bir hata oluştu.');
  }

};

exports.conf = {
  aliases: []
};

exports.help = {
  name: "tweet",
  description: "tweet atarsınız",
  kategori: "eglence"
};
