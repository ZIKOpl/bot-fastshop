const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getVouchesOfSeller } = require("../utils/vouchUtils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vouchinfo")
        .setDescription("Affiche les vouches d'un vendeur")
        .addUserOption(o => o.setName("vendeur").setDescription("Mentionne le vendeur").setRequired(true)),

    async execute(interaction) {
        const vendeur = interaction.options.getUser("vendeur");
        const { sellerVouches, moyenne } = getVouchesOfSeller(vendeur.id);

        if (sellerVouches.length === 0) {
            return interaction.reply({ content: `<@${vendeur.id}> n'a aucun vouch pour le moment.`, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle(`Vouches de <@${vendeur.id}>`)
            .setColor("#33FF66")
            .setDescription(`Nombre de vouches : ${sellerVouches.length} | Note moyenne : ${moyenne} ⭐`)
            .addFields(
                ...sellerVouches.map((v, i) => ({
                    name: `Vouch N°${v.vouchNum}`,
                    value: `${v.quantite}x ${v.item} (${v.prix} via ${v.moyen})\nNote: ${"⭐".repeat(v.note)}\nCommentaire: ${v.commentaire}\nDate: ${new Date(v.date).toLocaleString("fr-FR")}`,
                    inline: false
                }))
            );

        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};
