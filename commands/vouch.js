const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { addVouch } = require("../utils/vouchUtils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vouch")
        .setDescription("Donne ton avis sur un service")
        .addUserOption(o => o.setName("vendeur").setDescription("Mentionne le vendeur").setRequired(true))
        .addIntegerOption(o => o.setName("quantite").setDescription("Quantité achetée").setRequired(true))
        .addStringOption(o => o.setName("item").setDescription("Choisis l'item").setRequired(true))
        .addStringOption(o => o.setName("prix").setDescription("Prix payé").setRequired(true))
        .addStringOption(o => o.setName("moyen_de_paiement").setDescription("Moyen de paiement").setRequired(true))
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

        const stars = "⭐".repeat(note) + "☆".repeat(5 - note);

        const embed = new EmbedBuilder()
            .setTitle(`Nouveau Vouch de ${interaction.user.username}`)
            .setColor("#3366FF")
            .setThumbnail(interaction.user.displayAvatarURL({ size: 1024 }))
            .addFields(
                { name: "Note", value: stars, inline: false },
                { name: "Vendeur", value: `<@${vendeur.id}>`, inline: false },
                { name: "Item vendu", value: `${quantite}x ${item} (${prix} via ${moyen})`, inline: false },
                { name: "Vouch par", value: `<@${interaction.user.id}>`, inline: false },
                { name: "Date du vouch", value: new Date().toLocaleString("fr-FR"), inline: false },
                { name: "Commentaire", value: commentaire, inline: false }
            )
            .setFooter({ text: "Service proposé par Fast Shop by Ziko" });

        const channel = interaction.guild.channels.cache.get("1417943146653810859");
        if (!channel) return interaction.reply({ content: "Channel introuvable.", ephemeral: true });

        await channel.send({ embeds: [embed] });

        // Ajouter le vouch dans le JSON
        const vouchNum = addVouch(interaction.user.id, vendeur.id, note, quantite, item, prix, moyen, commentaire);

        await interaction.reply({ content: `Ton vouch a été envoyé ! (Vouch N°${vouchNum}) ✅`, ephemeral: true });
    }
};
