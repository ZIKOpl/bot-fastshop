const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { addVouch } = require("../utils/vouches");

let vouchCount = 1;

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
        .addStringOption(o => o.setName("commentaire").setDescription("Commentaire").setRequired(true)), // ✅ Obligatoire

    async execute(interaction) {
        const vendeur = interaction.options.getUser("vendeur");
        const quantite = interaction.options.getInteger("quantite");
        const item = interaction.options.getString("item");
        const prix = interaction.options.getString("prix");
        const moyen = interaction.options.getString("moyen_de_paiement");
        const note = interaction.options.getInteger("note");
        const commentaire = interaction.options.getString("commentaire");
        const client = interaction.user; // ✅ La personne qui fait le vouch

        const stars = "⭐".repeat(note) + "☆".repeat(5 - note);

        const embed = new EmbedBuilder()
            .setTitle(`New Vouch de ${client.username}`)
            .setColor("#3366FF")
            .setThumbnail(client.displayAvatarURL({ size: 1024 })) // ✅ Photo du client
            .addFields(
                { name: "Note", value: stars, inline: false },
                { name: "Vendeur", value: `<@${vendeur.id}>`, inline: false },
                { name: "Item vendu", value: `${quantite}x ${item} (${prix} via ${moyen})`, inline: false },
                { name: "Vouch N°", value: `${vouchCount}`, inline: false },
                { name: "Vouch par", value: `<@${client.id}>`, inline: false }, // ✅ Mention directe du client
                { name: "Date du vouch", value: new Date().toLocaleString("fr-FR"), inline: false },
                { name: "Commentaire", value: commentaire, inline: false }
            )
            .setFooter({ text: "Service proposé par FastShop by ziko" });

        const channel = interaction.guild.channels.cache.get("1417943146653810859");
        if (!channel) return interaction.reply({ content: "Channel introuvable.", ephemeral: true });

        await channel.send({ embeds: [embed] });

        addVouch(client.id, {
            vendeur_id: vendeur.id,
            quantite,
            item,
            prix,
            moyen,
            note,
            commentaire,
            date: new Date().toISOString(),
        });

        vouchCount++;
        await interaction.reply({ content: "Ton vouch a été envoyé ! ✅", ephemeral: true });
    }
};
