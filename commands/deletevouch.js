const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { deleteLastVouch } = require("../utils/vouchUtils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deletevouch")
        .setDescription("Supprime ton dernier vouch"),

    async execute(interaction) {
        const removed = deleteLastVouch(interaction.user.id);
        if (!removed) {
            return interaction.reply({ content: "Tu n'as aucun vouch à supprimer.", ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle("Dernier Vouch Supprimé")
            .setColor("#FF0000")
            .setDescription(`<@${interaction.user.id}> a supprimé son dernier vouch !`)
            .addFields(
                { name: "Vendeur", value: `<@${removed.vendeurId}>`, inline: false },
                { name: "Item vendu", value: `${removed.quantite}x ${removed.item} (${removed.prix} via ${removed.moyen})`, inline: false },
                { name: "Note", value: "⭐".repeat(removed.note) + "☆".repeat(5 - removed.note), inline: false },
                { name: "Commentaire", value: removed.commentaire, inline: false },
                { name: "Date", value: new Date(removed.date).toLocaleString("fr-FR"), inline: false }
            );

        const channel = interaction.guild.channels.cache.get("1417943146653810859");
        if (!channel) return interaction.reply({ content: "Channel introuvable.", ephemeral: true });

        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: "✅ Ton dernier vouch a été supprimé.", ephemeral: true });
    }
};
