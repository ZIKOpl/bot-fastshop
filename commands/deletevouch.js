const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { deleteLastVouch } = require("../utils/vouches");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deletevouch")
        .setDescription("Supprime ton dernier vouch"),

    async execute(interaction) {
        const { success, messageId } = deleteLastVouch(interaction.user.id);

        if (!success) {
            return interaction.reply({ content: "❌ Tu n'as aucun vouch à supprimer.", flags: 64 });
        }

        try {
            const channel = interaction.guild.channels.cache.get("1417943146653810859");
            if (channel) {
                const msg = await channel.messages.fetch(messageId);
                if (msg) await msg.delete();
            }
        } catch (err) {
            console.error("Erreur suppression message :", err);
        }

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`❌ <@${interaction.user.id}> a supprimé son dernier vouch.`);

        await interaction.reply({ embeds: [embed] });
    }
};
