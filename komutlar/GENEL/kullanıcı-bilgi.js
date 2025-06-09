const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

exports.run = async (client, message, args) => {
    const guild = message.guild;
    const member = message.mentions.members.first() || message.member;
    const timestamp = member.joinedTimestamp;
    const formattedTime = `<t:${Math.floor(timestamp / 1000)}:F>`;
    const formattedTime2 = `<t:${Math.floor(timestamp / 1000)}:R>`;
    const timestamp2 = member.user.createdTimestamp;
    const formattedTime3 = `<t:${Math.floor(timestamp2 / 1000)}:F>`;
    const formattedTime4 = `<t:${Math.floor(timestamp2 / 1000)}:R>`;
    const komutlarEmbed = new EmbedBuilder()
      .setAuthor({ name: `${member.user.username} Kullanıcı Bilgisi!`, iconURL: message.client.user.displayAvatarURL() })
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setTimestamp()
      .setImage(member.user.bannerURL({ dynamic: true }))
      .setFooter({ text: `Kullanan: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setDescription(`${member} - ${member.id} Kullancısın Bilgisi`)
      .setFields(
        { name: `Kullanıcı Adı`, value: `**${member.user.username}**` },
        { name: `Kullanıcı İdsi`, value: `**${member.id}**` },
        { name: `Kullanıcının Sunucuya Giriş Tarihi`, value: `**${formattedTime}(${formattedTime2})**` },
        { name: `Kullanıcının Discorda Giriş Tarihi`, value: `**${formattedTime3}(${formattedTime4})**` },
        { name: `Rolleri`, value: `${member.roles.cache.map(rol => `${rol},`)}`},
      )

    await message.reply({ embeds: [komutlarEmbed] });
}
exports.conf = {
    aliases: ["kb", "kullanıcıbilgi"]
}
exports.help = {
    name: 'kullanıcı-bilgi',
    description: 'İstenilen Kullanıcın Bilgisin Verir',
    kategori: "genel"
};