require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");

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

// ----- Ready event -----
client.once(Events.ClientReady, async () => {
    console.log(`💙 ${client.user.tag} ready!`);

    // Synchronisation des commandes sur le serveur (guild)
    const guildId = process.env.GUILD_ID;
    if (guildId) {
        const guild = await client.guilds.fetch(guildId);
        if (guild) {
            await guild.commands.set(client.commands.map(cmd => cmd.data.toJSON()));
            console.log("✅ Commandes synchronisées avec le serveur.");
        }
    } else {
        // Commandes globales
        await client.application.commands.set(client.commands.map(cmd => cmd.data.toJSON()));
        console.log("✅ Commandes globales synchronisées.");
    }
});

// ----- Interaction event -----
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (!interaction.replied) {
            await interaction.reply({ content: "❌ Une erreur est survenue.", ephemeral: true });
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
client.login(process.env.BOT_TOKEN);
