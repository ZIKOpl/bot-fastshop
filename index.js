require('dotenv').config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const { updateLeaderboard } = require("./utils/leaderboard"); // Import du leaderboard utils

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
client.once(Events.ClientReady, async () => {
    console.log(`💙 ${client.user.tag} ready!`);

    // Mettre à jour le leaderboard au démarrage si des vouches existent
    if (Object.keys(leaderboard).length > 0) {
        try {
            await updateLeaderboard(client, leaderboard);
        } catch (err) {
            console.error("❌ Erreur lors de la mise à jour du leaderboard au démarrage :", err);
        }
    }

    // Commandes guild synchronisées **manuellement via deploy-commands.js**
    console.log("✅ Bot prêt, commandes slash à synchroniser via 'npm run deploy'");
});

// ----- Interaction event -----
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, leaderboard, saveLeaderboard, client);
    } catch (error) {
        console.error(error);
        if (!interaction.replied) {
            await interaction.reply({ content: "❌ Une erreur est survenue.", flags: 64 }); // ephemeral
        }
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
client.login(process.env.BOT_TOKEN).catch(err => {
    console.error("❌ Impossible de se connecter avec le BOT_TOKEN :", err);
});
