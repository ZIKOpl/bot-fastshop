const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const VOUCH_FILE = path.join(__dirname, "../vouches.json");

function loadVouches() {
    if (!fs.existsSync(VOUCH_FILE)) return {};
    return JSON.parse(fs.readFileSync(VOUCH_FILE));
}

function saveVouches(vouches) {
    fs.writeFileSync(VOUCH_FILE, JSON.stringify(vouches, null, 4));
}

async function sendLeaderboard(client, channelId) {
    const vouches = loadVouches();
    const channel = await client.channels.fetch(channelId);
    if (!channel) return;

    const repMap = {};
    for (const v of Object.values(vouches)) {
        if (!repMap[v.vendeur_id]) repMap[v.vendeur_id] = 0;
        repMap[v.vendeur_id] += v.note;
    }

    const sorted = Object.entries(repMap).sort((a, b) => b[1] - a[1]);

    const embed = new EmbedBuilder()
        .setTitle("🍥 Seller Leaderboard")
        .setColor(0x3498db)
        .setFooter({ text: "Leaderboard mis à jour" });

    let totalRep = 0;
    let desc = "";
    sorted.forEach(([id, rep], i) => {
        totalRep += rep;
        desc += `${i + 1}. <@${id}> : ${rep} Rep\n`;
    });

    desc += `\nTotal de rep : ${totalRep}`;
    embed.setDescription(desc || "Aucun vouch pour le moment");

    await channel.send({ embeds: [embed] });
}

module.exports = { loadVouches, saveVouches, sendLeaderboard };
