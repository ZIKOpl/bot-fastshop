const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { deleteLastVouch } = require("../utils/vouches");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deletevouch")
        .setDescription("Supprime ton dernier vouch"),

    async execute(interaction) {
        const lastVouch = deleteLastVouch(interaction.user.id);
        if (!lastVouch) {
            return interaction.reply({ content: "❌ Aucun vouch à supprimer.", ephemeral: true });
        }

        const channel = interaction.guild.channels.cache.get("1417943146653810859");
        if (!channel) return interaction.reply({ content: "Channel introuvable.", ephemeral: true });

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`<@${interaction.user.id}> a supprimé son dernier vouch.`);

        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: "✅ Ton dernier vouch a été supprimé.", ephemeral: true });
    }
};
