const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const VOUCH_FILE = path.join(__dirname, "../vouches.json");
let vouches = {};
let vouchCounter = 0;

// Load vouches
if (fs.existsSync(VOUCH_FILE)) {
    vouches = JSON.parse(fs.readFileSync(VOUCH_FILE));
    vouchCounter = Math.max(0, ...Object.keys(vouches).map(k => parseInt(k)));
}

function saveVouches() {
    fs.writeFileSync(VOUCH_FILE, JSON.stringify(vouches, null, 4));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vouch")
        .setDescription("Donne ton avis sur un service")
        .addUserOption(option => option.setName("vendeur").setDescription("Mentionne le vendeur").setRequired(true))
        .addIntegerOption(option => option.setName("quantite").setDescription("Quantité achetée").setRequired(true))
        .addStringOption(option => option.setName("item").setDescription("Choisis l'item").setRequired(true)
            .addChoices(
                { name: "Nitro Boost 1 Month", value: "Nitro Boost 1 Month" },
                { name: "Nitro Basic 1 month", value: "Nitro Basic 1 month" },
                { name: "Discord Account", value: "Discord Account" },
                { name: "Server Boost", value: "Server Boost" },
                { name: "Message Réaction", value: "Message Réaction" },
                { name: "Décoration", value: "Décoration" }
            ))
        .addStringOption(option => option.setName("prix").setDescription("Prix payé").setRequired(true))
        .addStringOption(option => option.setName("moyen_de_paiement").setDescription("Moyen de paiement").setRequired(true)
            .addChoices(
                { name: "PayPal", value: "PayPal" },
                { name: "LTC", value: "LTC" }
            ))
        .addIntegerOption(option => option.setName("note").setDescription("Note 1-5").setRequired(true))
        .addStringOption(option => option.setName("commentaire").setDescription("Commentaire").setRequired(false))
        .addStringOption(option => option.setName("anonyme").setDescription("Anonyme ?").setRequired(true)
            .addChoices(
                { name: "Oui", value: "Oui" },
                { name: "Non", value: "Non" }
            )),
    async execute(interaction) {
        vouchCounter++;
        const vendeur = interaction.options.getUser("vendeur");
        const quantite = interaction.options.getInteger("quantite");
        const item = interaction.options.getString("item");
        const prix = interaction.options.getString("prix");
        const moyen = interaction.options.getString("moyen_de_paiement");
        const note = interaction.options.getInteger("note");
        const commentaire = interaction.options.getString("commentaire") || "Aucun commentaire";
        const anonyme = interaction.options.getString("anonyme");
        const acheteurDisplay = anonyme === "Non" ? interaction.user.username : "👤 Anonyme";
        const stars = "⭐".repeat(note);
        const dateStr = new Date().toLocaleString("fr-FR");

        const embed = new EmbedBuilder()
            .setTitle(`New Vouch de ${interaction.user.username}`)
            .setColor(0x3498db)
            .addFields(
                { name: "Note", value: stars, inline: false },
                { name: "Vendeur", value: `<@${vendeur.id}>`, inline: false },
                { name: "Item vendu", value: `x${quantite} ${item} (${prix} via ${moyen})`, inline: false },
                { name: "Vouch N°", value: `${vouchCounter}`, inline: true },
                { name: "Vouch par", value: acheteurDisplay, inline: true },
                { name: "Date du vouch", value: dateStr, inline: true },
                { name: "Commentaire", value: commentaire, inline: false }
            )
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFooter({ text: "Service proposé par FastShop • Optimisé" });

        const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

        vouches[vouchCounter] = {
            message_id: msg.id,
            channel_id: msg.channel.id,
            author_id: interaction.user.id
        };
        saveVouches();
    }
};
