const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const { updateLeaderboard } = require("../utils/leaderboard");

const VOUCH_FILE = "vouches.json";
const STAFF_ROLE_ID = "1418652782625296445";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resetvouch")
        .setDescription("Réinitialise tous les vouches (Staff uniquement)"),

    async execute(interaction, client) {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
            return interaction.reply({ content: "❌ Tu n'as pas la permission.", ephemeral: true });
        }

        if (fs.existsSync(VOUCH_FILE)) {
            fs.unlinkSync(VOUCH_FILE);
        }

        await interaction.reply({ content: "✅ Tous les vouches ont été réinitialisés.", ephemeral: true });
        await updateLeaderboard(client, {});
    }
};
