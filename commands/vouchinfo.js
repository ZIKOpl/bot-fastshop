const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getVouchesForVendeur } = require("../utils/vouches");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vouchinfo")
        .setDescription("Voir les informations de vouch d'un vendeur")
        .addUserOption(o => o.setName("vendeur").setDescription("Le vendeur").setRequired(true)),

    async execute(interaction) {
        const vendeur = interaction.options.getUser("vendeur");
        const vouches = getVouchesForVendeur(vendeur.id);

        if (vouches.length === 0) {
            return interaction.reply({ content: `❌ <@${vendeur.id}> n'a reçu aucun vouch.`, flags: 64 });
        }

        const totalNotes = vouches.reduce((acc, v) => acc + v.note, 0);
        const moyenne = totalNotes / vouches.length;
        const stars = "⭐".repeat(Math.round(moyenne)) + "☆".repeat(5 - Math.round(moyenne));

        const embed = new EmbedBuilder()
            .setTitle(`📊 Informations Vouch pour ${vendeur.username}`)
            .setColor("#3366FF")
            .addFields(
                { name: "📌 Nombre total de vouch", value: `${vouches.length}`, inline: false },
                { name: "⭐ Moyenne des notes", value: `${stars} (${moyenne.toFixed(2)}/5)`, inline: false }
            );

        await interaction.reply({ embeds: [embed] });
    }
};
