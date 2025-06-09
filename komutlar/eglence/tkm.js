const { EmbedBuilder } = require("discord.js")
const { RockPaperScissors } = require('discord-gamecord');
const { prefix, color } = require("../../ayarlar.js")
exports.run = async (client, message, args) => {
     let user = message.mentions.users.first()
     if (!user) return message.reply({ content: `**Taş Kağıt Makas** oyununu oynayabilmek için birini etiketlemen gerekli.` })
     const Game = new RockPaperScissors({
          message: message,
          isSlashGame: false,
          opponent: message.mentions.users.first(),
          embed: {
               title: 'Taş Kağıt Makas',
               color: '#5865F2',
               description: 'Seçim yapmak için aşağıdaki düğmeye basın.'
          },
          buttons: {
               rock: 'Taş',
               paper: 'Kağıt',
               scissors: 'Makas'
          },
          emojis: {
               rock: '🌑',
               paper: '📰',
               scissors: '✂️'
          },
          mentionUser: true,
          timeoutTime: 60000,
          buttonStyle: 'PRIMARY',
          pickMessage: "{emoji}'yi seçtiniz.",
          winMessage: '**{player}** Oyunu kazandı! Tebrikler!',
          tieMessage: 'Oyun berabere kaldı! Oyunu Kazanan Kimse Yok!',
          timeoutMessage: 'Oyun yarım kaldı! Oyunu Kazanan Kimse Yok!',
          playerOnlyMessage: 'Bu butonları yalnızca {player} ve {opponent} kullanabilir.'
     });

     Game.startGame();
     Game.on('gameOver', result => {
          return;
     });



}
exports.conf = {
     aliases: ["taşkağıtmakas"]
}
exports.help = {
     name: "tkm",
     description: "İstediğin biriyle taş kağıt makas oyununu oynarsın.",
     kategori: "eglence"
}