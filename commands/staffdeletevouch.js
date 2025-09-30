const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const STAFF_ROLE_ID = "1418652782625296445"; // ID du rôle Staff
const VOUCH_FILE = path.join(__dirname, "../vouches.json");
let vouches = fs.existsSync(VOUCH_FILE) ? JSON.parse(fs.readFileSync(VOUCH_FILE)) : {};

function saveVouches() {
    fs.writeFileSync(VOUCH_FILE, JSON.stringify(vouches, null, 4));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("staffdeletevouch")
        .setDescription("Supprime un vouch (Staff uniquement)")
        .addIntegerOption(option => option.setName("vouch_id").setDescription("ID du vouch à supprimer").setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
            return interaction.reply({ content: "❌ Tu n'as pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        const vouchId = interaction.options.getInteger("vouch_id");

        if (!vouches[vouchId]) {
            return interaction.reply({ content: "❌ Aucun vouch trouvé avec cet ID.", ephemeral: true });
        }

        try {
            const channel = await interaction.client.channels.fetch(vouches[vouchId].channel_id);
            const msg = await channel.messages.fetch(vouches[vouchId].message_id);
            await msg.delete();
            delete vouches[vouchId];
            saveVouches();
            await interaction.reply({ content: `✅ Le vouch **#${vouchId}** a été supprimé.`, ephemeral: true });
        } catch {
            await interaction.reply({ content: "⚠️ Ce vouch n'existe plus.", ephemeral: true });
        }
    }
};
