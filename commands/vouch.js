// commands/vouch.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

// Fichier JSON pour stocker les vouches
const VOUCH_FILE = path.join(__dirname, "../vouch.json");

// Charger ou initialiser le JSON
let vouches = { count: 0, data: [] };
if (fs.existsSync(VOUCH_FILE)) {
    vouches = JSON.parse(fs.readFileSync(VOUCH_FILE));
}

// Fonction pour sauvegarder le JSON
function saveVouches() {
    fs.writeFileSync(VOUCH_FILE, JSON.stringify(vouches, null, 4));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vouch")
        .setDescription("Donne ton avis sur un service")
        .addUserOption(o => o.setName("vendeur").setDescription("Mentionne le vendeur").setRequired(true))
        .addIntegerOption(o => o.setName("quantite").setDescription("Quantité achetée").setRequired(true))
        .addStringOption(o => o.setName("item").setDescription("Choisis l'item").setRequired(true)
            .addChoices(
                { name: "Nitro Boost 1 Month", value: "Nitro Boost 1 Month" },
                { name: "Nitro Basic 1 Month", value: "Nitro Basic 1 Month" },
                { name: "Discord Account", value: "Discord Account" },
                { name: "Server Boost", value: "Server Boost" },
                { name: "Message Réaction", value: "Message Réaction" },
                { name: "Décoration", value: "Décoration" }
            ))
        .addStringOption(o => o.setName("prix").setDescription("Prix payé").setRequired(true))
        .addStringOption(o => o.setName("moyen_de_paiement").setDescription("Moyen de paiement").setRequired(true)
            .addChoices(
                { name: "Paypal", value: "Paypal" },
                { name: "LTC", value: "Litecoin" }
            ))
        .addIntegerOption(o => o.setName("note").setDescription("Note 1-5").setRequired(true))
        .addStringOption(o => o.setName("commentaire").setDescription("Commentaire").setRequired(true)),

    async execute(interaction) {
        const vendeur = interaction.options.getUser("vendeur");
        const quantite = interaction.options.getInteger("quantite");
        const item = interaction.options.getString("item");
        const prix = interaction.options.getString("prix");
        const moyen = interaction.options.getString("moyen_de_paiement");
        const note = interaction.options.getInteger("note");
        const commentaire = interaction.options.getString("commentaire");
        const client = interaction.user;

        // Générer les étoiles
        const stars = "⭐".repeat(note) + "☆".repeat(5 - note);

        // Incrémenter le compteur de vouch
        vouches.count++;
        const vouchNumber = vouches.count;

        // Créer l'embed du vouch
        const embed = new EmbedBuilder()
            .setTitle(`New Vouch de ${client.username}`)
            .setColor("#3366FF")
            .setThumbnail(client.displayAvatarURL({ size: 1024 })) // photo du client
            .addFields(
                { name: "Note", value: stars, inline: false },
                { name: "Vendeur", value: `<@${vendeur.id}>`, inline: false },
                { name: "Item vendu", value: `${quantite}x ${item} (${prix} via ${moyen})`, inline: false },
                { name: "Vouch N°", value: `${vouchNumber}`, inline: false },
                { name: "Vouch par", value: `<@${client.id}>`, inline: false },
                { name: "Date du vouch", value: new Date().toLocaleString("fr-FR"), inline: false },
                { name: "Commentaire", value: commentaire, inline: false }
            )
            .setFooter({ text: "Service proposé par Fast Shop by Ziko" });

        // Envoi dans le salon vouches
        const channel = interaction.guild.channels.cache.get("1417943146653810859");
        if (!channel) {
            if (!interaction.replied) {
                await interaction.reply({ content: "Channel introuvable.", ephemeral: true });
            }
            return;
        }

        try {
            await channel.send({ embeds: [embed] });

            // Ajouter au JSON
            vouches.data.push({
                vouchNumber,
                client_id: client.id,
                vendeur_id: vendeur.id,
                quantite,
                item,
                prix,
                moyen,
                note,
                commentaire,
                date: new Date().toISOString()
            });
            saveVouches();

            // Répondre au client
            if (!interaction.replied) {
                await interaction.reply({ content: "Ton vouch a été envoyé ! ✅", ephemeral: true });
            }
        } catch (err) {
            console.error(err);
            if (!interaction.replied) {
                await interaction.reply({ content: "❌ Une erreur est survenue.", ephemeral: true });
            } else {
                await interaction.followUp({ content: "❌ Une erreur est survenue.", ephemeral: true });
            }
        }
    }
};
