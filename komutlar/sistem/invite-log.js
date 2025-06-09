const { EmbedBuilder, ChannelType, ChannelSelectMenuBuilder, ActionRowBuilder, PermissionFlagsBits } = require("discord.js")
const { prefix, color } = require("../../ayarlar.js")
const db = require("croxydb")
exports.run = async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await message.reply("Bu komutu kullanmak için `Yönetici` yetkiniz olmalı.");
    }
    const dbkey = await db.get(`${message.guild.id}_invite`)
    const { kanal } = dbkey || {};
    const embed = new EmbedBuilder()
    .setAuthor({ name: `${client.user.username} - İnvite Sistemi`, iconURL: client.user.avatarURL() })
    .setFields(
        { name: `İnvite Kanalı` , value: `Bu Menüden İnvite (Davet) Kanalını Ayarlarsınız. (${kanal ? `<#${kanal}>` : `**Kanal Ayarlanmamış**`})` },
    )
    .setColor(color)
    .setFooter({ text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() });

    const kanal_menu = new ChannelSelectMenuBuilder()
    .setChannelTypes(ChannelType.AnnouncementThread, ChannelType.GuildText)
    .setCustomId("invite_kanal")
    .setMaxValues(1)
    .setMinValues(1)
    .setPlaceholder("İnvite Kanalı")
    if(kanal) kanal_menu.setDefaultChannels(kanal)
    
    const kanal_row = new ActionRowBuilder().setComponents(kanal_menu)

    await message.reply({ embeds: [embed], components: [kanal_row] })
}
exports.conf = {
    aliases: ["invitelog"]
}
exports.help = {
    name: 'invite-log',
    description: 'İnvite Log Sisteminin Ayarlarını Yaparsınız',
    kategori: "sistem"
};