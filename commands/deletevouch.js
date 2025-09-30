const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

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
        const vouchId = interaction.options.getInteger("vouch_id");

        if (!vouches[vouchId]) {
            return interaction.reply({ content: "❌ Aucun vouch trouvé avec cet ID.", ephemeral: true });
        }

        if (vouches[vouchId].author_id !== interaction.user.id) {
            return interaction.reply({ content: "❌ Tu ne peux supprimer que tes propres vouches.", ephemeral: true });
        }

        try {
            const channel = await interaction.client.channels.fetch(vouches[vouchId].channel_id);
            const msg = await channel.messages.fetch(vouches[vouchId].message_id);
            await msg.delete();
            delete vouches[vouchId];
            saveVouches();
            await interaction.reply({ content: `✅ Ton vouch **#${vouchId}** a été supprimé.`, ephemeral: true });
        } catch {
            await interaction.reply({ content: "⚠️ Ce vouch n'existe plus.", ephemeral: true });
        }
    }
};
