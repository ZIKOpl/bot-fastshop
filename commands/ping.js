const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Répond avec Pong et le ping du bot"),
    async execute(interaction) {
        const sent = await interaction.reply({ content: "Calcul du ping...", fetchReply: true });

        const embed = new EmbedBuilder()
            .setTitle("🏓 Pong !")
            .setColor("Blue")
            .addFields(
                { name: "Latence API", value: `${sent.createdTimestamp - interaction.createdTimestamp} ms`, inline: true },
                { name: "Latence WebSocket", value: `${interaction.client.ws.ping} ms`, inline: true }
            )
            .setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
    }
};