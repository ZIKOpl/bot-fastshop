const { EmbedBuilder } = require("discord.js");
const LEADERBOARD_CHANNEL_ID = "1416537207564668978";

async function updateLeaderboard(client, vouches) {
    const counts = {};
    for (const id in vouches) {
        const vendeurId = vouches[id].vendeur_id;
        if (!counts[vendeurId]) counts[vendeurId] = 0;
        counts[vendeurId]++;
    }

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    let desc = "";
    let total = 0;
    for (let i = 0; i < sorted.length; i++) {
        const userId = sorted[i][0];
        const rep = sorted[i][1];
        const user = await client.users.fetch(userId);
        desc += `${i + 1}. ${user} jusqu’au 1 octobre : ${rep} Rep\n`;
        total += rep;
    }
    desc += `\nTotal de rep : ${total}`;

    const embed = new EmbedBuilder()
        .setTitle("🍥 Sellers Leaderboard")
        .setDescription(desc || "Aucun vouch pour le moment.")
        .setColor("Blue")
        .setFooter({ text: "Automatically updated" });

    const channel = await client.channels.fetch(LEADERBOARD_CHANNEL_ID);
    const messages = await channel.messages.fetch({ limit: 10 });
    const msg = messages.find(m => m.author.id === client.user.id);

    if (msg) {
        await msg.edit({ embeds: [embed] });
    } else {
        await channel.send({ embeds: [embed] });
    }
}

module.exports = { updateLeaderboard };
