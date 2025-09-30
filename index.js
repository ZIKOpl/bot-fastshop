// index.js
require('dotenv').config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 10000;

// ----- Discord Bot -----
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// ----- Load commands -----
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// ----- Leaderboard data -----
const LEADERBOARD_FILE = path.join(__dirname, "leaderboard.json");
let leaderboard = {};
if (fs.existsSync(LEADERBOARD_FILE)) {
    leaderboard = JSON.parse(fs.readFileSync(LEADERBOARD_FILE));
}
function saveLeaderboard() {
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(leaderboard, null, 4));
}

// ----- Ready event -----
client.once("ready", async () => {
    console.log(`${client.user.tag} ready!`);

    // Sync commands for testing on a specific guild
    const guildId = process.env.GUILD_ID; // mettre ton GUILD_ID dans Render
    if (guildId) {
        const guild = client.guilds.cache.get(guildId);
        if (guild) {
            await guild.commands.set(client.commands.map(cmd => cmd.data.toJSON()));
            console.log("✅ Commandes synchronisées avec le serveur.");
        }
    } else {
        // global commands (peut prendre jusqu'à 1h pour apparaître)
        await client.application.commands.set(client.commands.map(cmd => cmd.data.toJSON()));
        console.log("✅ Commandes globales synchronisées.");
    }
});

// ----- Interaction event -----
client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, leaderboard, saveLeaderboard);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "❌ Une erreur est survenue.", ephemeral: true });
    }
});

// ----- Express Web Server -----
app.get("/", (req, res) => {
    res.send("Bot FastShop en ligne 🎉");
});

app.listen(PORT, () => {
    console.log(`🌐 Web server running on port ${PORT}`);
});

// ----- Login -----
client.login(process.env.BOT_TOKEN);
