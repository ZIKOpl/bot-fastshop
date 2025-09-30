const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const { updateLeaderboard } = require("../utils/leaderboard");

const VOUCH_FILE = "vouches.json";
const STAFF_ROLE_ID = "1418652782625296445";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("staffdeletevouch")
        .setDescription("Supprime un vouch (Staff uniquement)")
        .addIntegerOption(opt => opt.setName("vouch_id").setDescription("ID du vouch").setRequired(true)),

    async execute(interaction, client) {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
            return interaction.reply({ content: "❌ Tu n'as pas la permission.", ephemeral: true });
        }

        let vouches = {};
        if (fs.existsSync(VOUCH_FILE)) {
            vouches = JSON.parse(fs.readFileSync(VOUCH_FILE));
        }

        const vouchId = interaction.options.getInteger("vouch_id");
        if (!vouches[vouchId]) {
            return interaction.reply({ content: "❌ Aucun vouch trouvé avec cet ID.", ephemeral: true });
        }

        delete vouches[vouchId];
        fs.writeFileSync(VOUCH_FILE, JSON.stringify(vouches, null, 4));
        await interaction.reply({ content: `✅ Vouch #${vouchId} supprimé par le staff !`, ephemeral: true });
        await updateLeaderboard(client, vouches);
    }
};
