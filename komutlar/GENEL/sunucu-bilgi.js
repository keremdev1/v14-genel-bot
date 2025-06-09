const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

exports.run = async (client, message, args) => {
    const guild = message.guild;
    const timestamp2 = guild.createdTimestamp;
    const formattedTime3 = `<t:${Math.floor(timestamp2 / 1000)}:F>`;
    const formattedTime4 = `<t:${Math.floor(timestamp2 / 1000)}:R>`;
    const komutlarEmbed = new EmbedBuilder()
      .setAuthor({ name: `${guild.name} Sunucusu Bilgisi!`, iconURL: message.client.user.displayAvatarURL() })
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ text: `Kullanan: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setDescription(`${guild.name} - ${guild.id} Sunucu Bilgisi`)
      .addFields(
        { name: `Sunucu Adı`, value: `**${guild.name}**` },
        { name: `Sunucu İdsi`, value: `**${guild.id}**` },
        { name: `Sunucu Oluşturulma Tarihi`, value: `**${formattedTime3} (${formattedTime4})**` },
        { name: `Sunucu Sahibi`, value: `<@${guild.ownerId}>` },
        { name: `Rol Sayısı`, value: `**${guild.roles.cache.size}**` },
        { name: `Kanal Sayısı`, value: `**${guild.channels.cache.size}**` },
        { name: `Emoji Sayısı`, value: `**${guild.emojis.cache.size}**` },
        { name: `Kullanıcı Sayısı`, value: `**${guild.memberCount}**` },
      );

    await message.reply({ embeds: [komutlarEmbed] });
}

exports.conf = {
    aliases: ["sunucubilgi", "sb"],
};

exports.help = {
    name: 'sunucu-bilgi',
    description: 'Sunucun Bilgisin Verir',
    kategori: "genel"
};