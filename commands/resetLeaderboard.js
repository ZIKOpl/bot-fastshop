const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const LEADERBOARD_FILE = path.join(__dirname, '../leaderboard.json');
const VOUCH_FILE = path.join(__dirname, '../vouches.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetleaderboard')
        .setDescription('⚠️ Réinitialise complètement le leaderboard et les vouches')
        .addStringOption(option =>
            option.setName('confirmation')
                .setDescription('Tape "CONFIRMER" pour valider')
                .setRequired(true)
        ),

    async execute(interaction, leaderboard, saveLeaderboard) {
        const confirmation = interaction.options.getString('confirmation');

        if (confirmation !== 'CONFIRMER') {
            return interaction.reply({ 
                content: '❌ Tu dois écrire **CONFIRMER** pour valider la réinitialisation.', 
                ephemeral: true 
            });
        }

        // Reset des fichiers
        fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify({}, null, 4));
        fs.writeFileSync(VOUCH_FILE, JSON.stringify({}, null, 4));

        saveLeaderboard(); // Sauvegarde du leaderboard (vide)

        await interaction.reply({ 
            content: '✅ Leaderboard et vouches réinitialisés avec succès.', 
            ephemeral: false 
        });
    }
};
