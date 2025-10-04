const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const vouchFile = path.join(__dirname, "../vouch.json");
let vouches = {};
let vouchCount = 1;

// Charger le JSON au démarrage
if (fs.existsSync(vouchFile)) {
    vouches = JSON.parse(fs.readFileSync(vouchFile));
    // Définir le compteur sur la dernière vouch existante
    const allVouches = Object.values(vouches).flat();
    if (allVouches.length > 0) {
        vouchCount = allVouches.length + 1;
    }
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
                { name: "Ltc", value: "Litecoin" }
            ))
        .addIntegerOption(o => o.setName("note").setDescription("Note 1-5").setRequired(true))
        .addStringOption(o => o.setName("commentaire").setDescription("Commentaire obligatoire").setRequired(true)),

    async execute(interaction) {
        const vendeur = interaction.options.getUser("vendeur");
        const quantite = interaction.options.getInteger("quantite");
        const item = interaction.options.getString("item");
        const prix = interaction.options.getString("prix");
        const moyen = interaction.options.getString("moyen_de_paiement");
        const note = interaction.options.getInteger("note");
        const commentaire = interaction.options.getString("commentaire");
        const user = interaction.user;

        const stars = "⭐".repeat(note) + "☆".repeat(5 - note);

        const embed = new EmbedBuilder()
            .setTitle(`New Vouch de ${user.username}`)
            .setColor("#3366FF")
            .setThumbnail(user.displayAvatarURL({ size: 1024 }))
            .addFields(
                { name: "Note", value: stars, inline: false },
                { name: "Vendeur", value: `<@${vendeur.id}>`, inline: false },
                { name: "Item vendu", value: `${quantite}x ${item} (${prix} via ${moyen})`, inline: false },
                { name: "Vouch N°", value: `${vouchCount}`, inline: false },
                { name: "Vouch par", value: `<@${user.id}>`, inline: false },
                { name: "Date du vouch", value: new Date().toLocaleString("fr-FR"), inline: false },
                { name: "Commentaire", value: commentaire, inline: false }
            )
            .setFooter({ text: "Service proposé par Lightvault by 3keh" });

        const channel = interaction.guild.channels.cache.get("1417943146653810859");
        if (!channel) return interaction.reply({ content: "Channel introuvable.", ephemeral: true });

        await channel.send({ embeds: [embed] });

        // Ajouter au JSON
        if (!vouches[user.id]) vouches[user.id] = [];
        vouches[user.id].push({
            vendeur_id: vendeur.id,
            quantite,
            item,
            prix,
            moyen,
            note,
            commentaire,
            date: new Date().toISOString(),
            vouchNumber: vouchCount
        });

        fs.writeFileSync(vouchFile, JSON.stringify(vouches, null, 4));
        vouchCount++;

        await interaction.reply({ content: "Ton vouch a été envoyé ! ✅", ephemeral: true });
    }
};
