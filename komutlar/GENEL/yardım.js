const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { prefix, color } = require('../../ayarlar.js');
const { StringSelectMenuBuilder } = require("@discordjs/builders");

exports.run = async (client, message, args) => {

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username} - Yardım`, iconURL: client.user.avatarURL() })
        .setDescription(`Aşağıdaki Menüden Komutları Görebilirsiniz`)
        .setColor(color)
        .setFooter({ text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() });

    const menu = new StringSelectMenuBuilder()
    .setCustomId("yardım_menu")
    .setMaxValues(1)
    .setMinValues(1)
    .setPlaceholder("Komutları Görmek İçin Kategori Seçin")
    .addOptions(
        { label: "Genel Komutlar", value: "genel"},
        { label: "Moderasyon Komutları", value: "moderasyon"},
        { label: "Eğlence Komutları", value: "eglence"},
        { label: "Sistem Komutları", value: "sistem"},
    )

    message.reply({ embeds: [embed], components: [ new ActionRowBuilder().addComponents(menu) ] });
}
exports.conf = {
    aliases: ["help", "h", "y", "cmd"],
};

exports.help = {
    name: 'yardım',
    description: 'Botun Pingini Gösterir.',
    kategori: "genel"
};
