const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { addVouch, getVouchCount } = require("../utils/vouches");

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
                { name: "Litecoin", value: "Litecoin" }
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

        const stars = "⭐".repeat(note) + "☆".repeat(5 - note);

        const vouchNumber = getVouchCount() + 1;

        const embed = new EmbedBuilder()
            .setTitle(`📩 Nouveau Vouch`)
            .setColor("#3366FF")
            .setThumbnail(interaction.user.displayAvatarURL({ size: 1024 }))
            .addFields(
                { name: "👤 Vendeur", value: `<@${vendeur.id}>`, inline: false },
                { name: "🛒 Item vendu", value: `${quantite}x ${item} (${prix} via ${moyen})`, inline: false },
                { name: "⭐ Note", value: stars, inline: false },
                { name: "📌 Vouch N°", value: `${vouchNumber}`, inline: false },
                { name: "✍️ Vouch par", value: `<@${interaction.user.id}>`, inline: false },
                { name: "🕒 Date du vouch", value: new Date().toLocaleString("fr-FR"), inline: false },
                { name: "💬 Commentaire", value: commentaire, inline: false }
            )
            .setFooter({ text: "Service proposé par Lightvault by 3keh" });

        const channel = interaction.guild.channels.cache.get("1417943146653810859");
        if (!channel) return interaction.reply({ content: "❌ Channel introuvable.", ephemeral: true });

        const msg = await channel.send({ embeds: [embed] });

        addVouch(interaction.user.id, {
            vendeur_id: vendeur.id,
            quantite,
            item,
            prix,
            moyen,
            note,
            commentaire,
            date: new Date().toISOString(),
            messageId: msg.id
        });

        await interaction.reply({ content: "✅ Ton vouch a été envoyé !", flags: 64 });
    }
};
