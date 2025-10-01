const { SlashCommandBuilder } = require('discord.js');
const { saveVouches, VOUCH_FILE } = require('../utils/leaderboard');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetleaderboard')
        .setDescription('Réinitialise toutes les vouches (Admin seulement)'),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has('Administrator'))
            return interaction.reply({ content: 'Tu n’as pas la permission.', ephemeral: true });

        saveVouches({});
        await interaction.reply({ content: 'Leaderboard réinitialisé ! ✅', ephemeral: true });
    }
};
