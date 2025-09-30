const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const STAFF_ROLE_ID = "1418652782625296445";
const VOUCH_FILE = path.join(__dirname, "../vouches.json");
let vouches = fs.existsSync(VOUCH_FILE) ? JSON.parse(fs.readFileSync(VOUCH_FILE)) : {};

function saveVouches() {
    fs.writeFileSync(VOUCH_FILE, JSON.stringify(vouches, null, 4));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resetvouch")
        .setDescription("Réinitialise tous les vouches (Staff uniquement)"),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
            return interaction.reply({ content: "❌ Tu n'as pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        for (const v of Object.values(vouches)) {
            try {
                const channel = await interaction.client.channels.fetch(v.channel_id);
                const msg = await channel.messages.fetch(v.message_id);
                await msg.delete();
            } catch {}
        }

        vouches = {};
        saveVouches();
        await interaction.reply({ content: "✅ Tous les vouches ont été réinitialisés.", ephemeral: true });
    }
};
