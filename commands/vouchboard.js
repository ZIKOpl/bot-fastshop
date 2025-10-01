const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { formatLeaderboard } = require('../utils/leaderboard');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vouchboard')
        .setDescription("Affiche le leaderboard des vendeurs"),

    async execute(interaction, leaderboard) {
        const embed = new EmbedBuilder()
            .setTitle("🍥 Sellers Leaderboard")
            .setColor('#3498db')
            .setDescription(formatLeaderboard(leaderboard))
            .setFooter({ text: "Mise à jour automatique après chaque vouch" });

        await interaction.reply({ embeds: [embed] });
    }
};
