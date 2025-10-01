const { SlashCommandBuilder } = require('discord.js');
const { removeVouch } = require('../utils/leaderboard');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletevouch')
        .setDescription("Supprime ton dernier vouch"),

    async execute(interaction, leaderboard, saveLeaderboard) {
        const userId = interaction.user.id;
        const removed = removeVouch(leaderboard, userId);
        saveLeaderboard();
        if (removed) {
            await interaction.reply({ content: "✅ Ton vouch a été supprimé.", ephemeral: true });
        } else {
            await interaction.reply({ content: "❌ Aucun vouch trouvé pour toi.", ephemeral: true });
        }
    }
};
