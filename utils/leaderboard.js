const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const VOUCH_FILE = path.join(__dirname, "../vouches.json");
const LEADERBOARD_CHANNEL_ID = "1416537207564668978"; // Remplace par ton channel

function saveVouches(vouches) {
    fs.writeFileSync(VOUCH_FILE, JSON.stringify(vouches, null, 4));
}

async function updateLeaderboard(client, vouches) {
    const channel = await client.channels.fetch(LEADERBOARD_CHANNEL_ID);
    if (!channel) return;

    const repMap = {};
    for (const v of Object.values(vouches)) {
        if (!repMap[v.vendeur_id]) repMap[v.vendeur_id] = 0;
        repMap[v.vendeur_id] += v.note;
    }

    const sorted = Object.entries(repMap).sort((a, b) => b[1] - a[1]);

    const embed = new EmbedBuilder()
        .setTitle("🍥 Sellers Leaderboard")
        .setColor(0x3498db)
        .setFooter({ text: "Automatically updated" });

    let totalRep = 0;
    let desc = "";

    sorted.forEach(([id, rep], i) => {
        totalRep += rep;
        desc += `${i + 1}. <@${id}> : ${rep} Rep\n`;
    });

    desc += `\nTotal de rep : ${totalRep}`;
    embed.setDescription(desc || "Aucun vouch pour le moment");

    const messages = await channel.messages.fetch({ limit: 10 });
    const msg = messages.find(m => m.author.id === client.user.id);
    if (msg) await msg.edit({ embeds: [embed] });
    else await channel.send({ embeds: [embed] });
}

module.exports = { updateLeaderboard, saveVouches };
