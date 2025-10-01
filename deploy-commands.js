const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { clientId, guildId, token } = require('./config.json'); // Ton fichier config avec token, clientId, guildId

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('🔄 Suppression de toutes les commandes guild existantes...');

        // Supprime toutes les commandes de ce serveur
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: [] }
        );
        console.log('✅ Commandes guild supprimées.');

        // Charge toutes les commandes actuelles dans le dossier ./commands
        const commands = [];
        const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

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
<<<<<<< HEAD
})();p
=======
})();p
>>>>>>> 8fe9979b9a497d052130ccaf475e21bb0506e2e6
