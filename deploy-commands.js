require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('🔄 Suppression de toutes les commandes guild existantes...');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: [] }
        );
        console.log('✅ Commandes guild supprimées.');

        const commands = [];
        const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            if (command.data) commands.push(command.data.toJSON());
        }

        console.log('🔄 Déploiement des commandes actuelles...');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );
        console.log('✅ Commandes déployées avec succès !');
    } catch (error) {
        console.error(error);
    }
})();
