const { SlashCommandBuilder } = require('discord.js');
const { saveVouches, VOUCH_FILE } = require('../utils/leaderboard');
const fs = require('fs');

let vouches = fs.existsSync(VOUCH_FILE) ? JSON.parse(fs.readFileSync(VOUCH_FILE)) : {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletevouch')
        .setDescription('Supprime un vouch par son numéro')
        .addIntegerOption(o => o.setName('numero').setDescription('Numéro du vouch').setRequired(true)),
    async execute(interaction, client) {
        const numero = interaction.options.getInteger('numero');
        const vouch = vouches[numero];

        if (!vouch) return interaction.reply({ content: "Vouch introuvable.", ephemeral: true });
        if (interaction.user.id !== vouch.auteur_id && !interaction.member.permissions.has('Administrator'))
            return interaction.reply({ content: "Tu ne peux pas supprimer ce vouch.", ephemeral: true });

        delete vouches[numero];
        saveVouches(vouches);

        await interaction.reply({ content: `Vouch #${numero} supprimé ✅`, ephemeral: true });
        await require('../utils/leaderboard').updateLeaderboard(client, vouches);
    }
};