const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Collection pour les commandes
client.commands = new Collection();

// Lecture des fichiers de commandes
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] La commande ${file} est mal formée.`);
    }
}

// Event ready
client.once("ready", () => {
    console.log(`${client.user.tag} est connecté !`);
});

// Event interactionCreate
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "❌ Une erreur est survenue en exécutant la commande.", ephemeral: true });
    }
});

// Connexion
client.login(process.env.TOKEN);
