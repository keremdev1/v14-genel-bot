const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, AttachmentBuilder } = require("discord.js");
const { prefix, color } = require("../../ayarlar.js");
const db = require("croxydb");
const canvafy = require("canvafy");

exports.run = async (client, message, args) => {
  const kullanıcı = message.mentions.members.first() || message.member;

  const activities = kullanıcı.presence?.activities || [];
  const spotifyActivity = activities.find(a => a.name === 'Spotify' && a.type === 2);

  if (!spotifyActivity) {
    return message.reply(`\`\`${kullanıcı.user.username}\`\` şu anda Spotify'da müzik dinlemiyor.`);
  }

  const trackName = spotifyActivity.details;
  const artist = spotifyActivity.state;
  const album = spotifyActivity.assets?.largeText || 'Unknown Album';

  const largeImageKey = spotifyActivity.assets?.largeImage;
  const albumImage = largeImageKey
    ? `https://i.scdn.co/image/${largeImageKey.replace('spotify:', '')}`
    : null;

  const trackUrl = `https://open.spotify.com/track/${spotifyActivity.syncId}`;

  const start = spotifyActivity.timestamps?.start;
  const end = spotifyActivity.timestamps?.end;

  let elapsedSeconds = 0;
  let totalSeconds = 0;

  if (start && end) {
    elapsedSeconds = Math.floor((Date.now() - start) / 1000);
    totalSeconds = Math.floor((end - start) / 1000);
  }

  const spotifykart = new canvafy.Spotify()
    .setAlbum(album)
    .setImage(albumImage)
    .setAuthor(artist)
    .setSpotifyLogo(true)
    .setBlur(5)
    .setTimestamp(elapsedSeconds, totalSeconds)
    .setTitle(trackName);

    const buffer = await spotifykart.build();
    const attachment = new AttachmentBuilder(buffer, { name: "spotify.png" });


  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Spotify'da Aç")
      .setStyle(ButtonStyle.Link)
      .setURL(trackUrl)
      .setEmoji("🎧")
  );

  message.reply({ files: [attachment], components: [row] });
};

exports.conf = {
  aliases: ["spotify-kart", "spotifykart"]
};
exports.help = {
  name: "spotify",
  description: "Kullanıcının Spotify Kartını Oluşturur",
  kategori: "eglence"
};
