const fs = require("fs");
const path = require("path");

const VOUCH_FILE = path.join(__dirname, "../vouch.json");

// Charge les vouches depuis le JSON
function loadVouches() {
    if (!fs.existsSync(VOUCH_FILE)) return {};
    return JSON.parse(fs.readFileSync(VOUCH_FILE));
}

// Sauvegarde les vouches dans le JSON
function saveVouches(data) {
    fs.writeFileSync(VOUCH_FILE, JSON.stringify(data, null, 4));
}

// Ajoute un vouch
function addVouch(userId, vendeurId, note, quantite, item, prix, moyen, commentaire) {
    const data = loadVouches();
    if (!data[userId]) data[userId] = [];
    const vouchNum = Object.values(data).flat().length + 1;
    data[userId].push({
        vouchNum,
        vendeurId,
        note,
        quantite,
        item,
        prix,
        moyen,
        commentaire,
        date: new Date().toISOString(),
    });
    saveVouches(data);
    return vouchNum;
}

// Supprime le dernier vouch d’un utilisateur
function deleteLastVouch(userId) {
    const data = loadVouches();
    if (!data[userId] || data[userId].length === 0) return null;
    const removed = data[userId].pop();
    saveVouches(data);
    return removed;
}

// Récupère les vouches d’un vendeur
function getVouchesOfSeller(vendeurId) {
    const data = loadVouches();
    const allVouches = Object.values(data).flat();
    const sellerVouches = allVouches.filter(v => v.vendeurId === vendeurId);
    const moyenne = sellerVouches.length === 0 ? 0 : (sellerVouches.reduce((a,b)=>a+b.note,0)/sellerVouches.length).toFixed(2);
    return { sellerVouches, moyenne };
}

module.exports = {
    loadVouches,
    saveVouches,
    addVouch,
    deleteLastVouch,
    getVouchesOfSeller
};
