const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const updateLeaderboard = require("../utils/leaderboard");

const VOUCH_FILE = path.join(__dirname, "../vouches.json");
let vouches = fs.existsSync(VOUCH_FILE) ? JSON.parse(fs.readFileSync(VOUCH_FILE)) : {};
const STAFF_ROLE_ID = "1418652782625296445";

function saveVouches() {
    fs.writeFileSync(VOUCH_FILE, JSON.stringify(vouches, null, 4));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("staffdeletevouch")
        .setDescription("Supprime un vouch (Staff uniquement)")
        .addIntegerOption(option => option.setName("vouch_id").setDescription("ID du vouch à supprimer").setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) return interaction.reply({ content: "❌ Tu n'as pas la permission.", ephemeral: true });

        const id = interaction.options.getInteger("vouch_id");
        if (!vouches[id]) return interaction.reply({ content: "❌ Aucun vouch trouvé avec cet ID.", ephemeral: true });

        try {
            const channel = interaction.client.channels.cache.get(vouches[id].channel_id);
            const msg = await channel.messages.fetch(vouches[id].message_id);
            await msg.delete();
        } catch {}
        delete vouches[id];
        saveVouches();
        await interaction.reply({ content: `✅ Le vouch **#${id}** a été supprimé.`, ephemeral: true });

        await updateLeaderboard(interaction.client, vouches);
    }
};
