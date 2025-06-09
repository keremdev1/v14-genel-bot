const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        const user = message.mentions.users.first() || message.author;
        const invites = await message.guild.invites.fetch();
        
        const userInvites = invites.filter(invite => invite.inviter && invite.inviter.id === user.id);
        
        if (userInvites.size === 0) {
            return message.channel.send(`${user} kullanıcısının bu sunucuda bir daveti yok.`);
        }
        let totalUses = 0;
        const inviteLinks = [];

        userInvites.forEach(invite => {
            totalUses += invite.uses;
            inviteLinks.push(`**${invite.url}** - Kullanımlar: ${invite.uses}`);
        });

        const davetEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setAuthor({
                name: `${client.user.username} - Davet`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setThumbnail(message.guild.iconURL())            
            .addFields(
                { name: 'Üye :', value: `<@${user.id}>` },
                { name: 'Toplam Kullanımlar:', value: `**${totalUses}**` },
                { name: 'Davet Linkleri:', value: inviteLinks.join('\n') || 'Davet yok' }
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Kullanan: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await message.channel.send({ embeds: [davetEmbed] });

    } catch (error) {
        console.error('Davet bilgilerini alırken bir hata oluştu:', error);
        await message.channel.send('Bir hata oluştu, lütfen tekrar deneyin.');
    }
};

exports.conf = {
    aliases: ["davetlerim", "invite"]
};

exports.help = {
    name: 'davet',
    description: 'Kullanıcının Davet Bilgisin Gösterir.',
    kategori: "genel"
};