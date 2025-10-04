const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const vouchFile = path.join(__dirname, "../vouch.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deletevouch")
        .setDescription("Supprime ton dernier vouch"),

    async execute(interaction) {
        const user = interaction.user;

        if (!fs.existsSync(vouchFile)) return interaction.reply({ content: "Aucun vouch trouvé.", ephemeral: true });

        const vouches = JSON.parse(fs.readFileSync(vouchFile));
        if (!vouches[user.id] || vouches[user.id].length === 0) {
            return interaction.reply({ content: "Tu n'as aucun vouch à supprimer.", ephemeral: true });
        }

        // Supprimer le dernier vouch
        const removed = vouches[user.id].pop();
        fs.writeFileSync(vouchFile, JSON.stringify(vouches, null, 4));

        const embed = new EmbedBuilder()
            .setTitle("Vouch supprimé")
            .setColor("Red")
            .setDescription(`<@${user.id}> a supprimé son dernier vouch.`);

        await interaction.reply({ embeds: [embed] });
    }
};
