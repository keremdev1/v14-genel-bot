const { prefix } = require("../../ayarlar.js");
const canvafy = require("canvafy");
const fs = require("fs");
const path = require("path");

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

exports.run = async (client, message, args) => {
  if (!args[0] && message.attachments.size === 0) {
    return message.reply(`:warning: Kullanım: \`${prefix}instagram <@üye|rte|kemal|bahçeli|metin> <resim URL veya mesaj eki>\``);
  }
  let postImage;
  if (message.attachments.size > 0) {
    const attachment = message.attachments.first();
    if (!attachment.contentType?.startsWith("image/")) {
      return message.reply(":x: Lütfen geçerli bir resim dosyası ekleyin.");
    }
    postImage = attachment.url;
  } else if (args[args.length - 1]?.startsWith("http")) {
    postImage = args.pop();
  } else {
    return message.reply(":x: Gönderi için bir resim URL'si verin ya da fotoğraf ekleyin.");
  }

  const mention = message.mentions.users.first();
  let userData;
  let caption;

  if (mention) {
    caption = args.slice(1).join(" ");
    if (!caption) return message.reply("Lütfen gönderi için bir açıklama yazın.");
    userData = {
      displayName: mention.globalName || mention.username,
      username: mention.username,
      avatar: mention.displayAvatarURL({ format: "png", size: 1024 })
    };
  } else if (args.length > 1 && presets[args[0].toLowerCase()]) {
    const preset = presets[args[0].toLowerCase()];
    userData = {
      displayName: preset.displayName,
      username: preset.username,
      avatar: preset.avatar
    };
    caption = args.slice(1).join(" ");
    if (!caption) return message.reply("Lütfen gönderi için bir açıklama yazın.");
  } else {
    caption = args.join(" ");
    if (!caption) return message.reply("Lütfen gönderi için bir açıklama yazın.");
    userData = {
      displayName: message.author.globalName || message.author.username,
      username: message.author.username,
      avatar: message.author.displayAvatarURL({ format: "png", size: 1024 })
    };
  }

  try {
const instagram = await new canvafy.Instagram()
  .setTheme("light")
  .setUser({ username: userData.username })
  .setAvatar(userData.avatar)
  .setLike({ count: Math.floor(Math.random() * 10000) + 100, likeText: "beğeni" })
  .setPostImage(postImage)
  .setPostDate(Date.now() - 1000 * 60 * 60 * 2)
  .setVerified(true)
  .setTheme("dark")
  .setStory(true)
  .setLiked(true)
  .setSaved(true)
  .build();

    message.reply({
      files: [{
        attachment: instagram,
        name: `instagram-${message.author.id}.png`
      }]
    });
  message.delete()
  } catch (err) {
    console.error(err);
    message.reply(":x: Gönderi oluşturulurken bir hata oluştu.");
  }
};

exports.conf = {
  aliases: ["insta"]
};

exports.help = {
  name: "instagram",
  description: "Instagram gönderisi oluşturur",
  kategori: "eglence"
};
