const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const updateLeaderboard = require("../utils/leaderboard");

const VOUCH_FILE = path.join(__dirname, "../vouches.json");
let vouches = fs.existsSync(VOUCH_FILE) ? JSON.parse(fs.readFileSync(VOUCH_FILE)) : {};

function saveVouches() {
    fs.writeFileSync(VOUCH_FILE, JSON.stringify(vouches, null, 4));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deletevouch")
        .setDescription("Supprime ton propre vouch")
        .addIntegerOption(option => option.setName("vouch_id").setDescription("ID du vouch à supprimer").setRequired(true)),
    async execute(interaction) {
        const id = interaction.options.getInteger("vouch_id");
        if (!vouches[id]) return interaction.reply({ content: "❌ Aucun vouch trouvé avec cet ID.", ephemeral: true });
        if (vouches[id].author_id !== interaction.user.id) return interaction.reply({ content: "❌ Tu ne peux supprimer que tes propres vouches.", ephemeral: true });

        try {
            const channel = interaction.client.channels.cache.get(vouches[id].channel_id);
            const msg = await channel.messages.fetch(vouches[id].message_id);
            await msg.delete();
        } catch {}
        delete vouches[id];
        saveVouches();
        await interaction.reply({ content: `✅ Ton vouch **#${id}** a été supprimé.`, ephemeral: true });

        await updateLeaderboard(interaction.client, vouches);
    }
};
