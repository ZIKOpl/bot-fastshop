const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const { updateLeaderboard } = require("../utils/leaderboard");

const VOUCH_FILE = "vouches.json";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deletevouch")
        .setDescription("Supprime ton propre vouch")
        .addIntegerOption(opt => opt.setName("vouch_id").setDescription("ID du vouch").setRequired(true)),

    async execute(interaction, client) {
        let vouches = {};
        if (fs.existsSync(VOUCH_FILE)) {
            vouches = JSON.parse(fs.readFileSync(VOUCH_FILE));
        }

        const vouchId = interaction.options.getInteger("vouch_id");
        if (!vouches[vouchId]) {
            return interaction.reply({ content: "❌ Aucun vouch trouvé avec cet ID.", ephemeral: true });
        }

        if (vouches[vouchId].auteur_id !== interaction.user.id) {
            return interaction.reply({ content: "❌ Tu ne peux supprimer que tes propres vouches.", ephemeral: true });
        }

        delete vouches[vouchId];
        fs.writeFileSync(VOUCH_FILE, JSON.stringify(vouches, null, 4));
        await interaction.reply({ content: `✅ Vouch #${vouchId} supprimé !`, ephemeral: true });
        await updateLeaderboard(client, vouches);
    }
};
