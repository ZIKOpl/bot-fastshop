const fs = require("fs");
const path = require("path");

const VOUCH_FILE = path.join(__dirname, "../vouches.json");

// Charger les vouches depuis le fichier
function loadVouches() {
    if (!fs.existsSync(VOUCH_FILE)) return {};
    return JSON.parse(fs.readFileSync(VOUCH_FILE));
}

// Sauvegarder les vouches
function saveVouches(vouches) {
    fs.writeFileSync(VOUCH_FILE, JSON.stringify(vouches, null, 4));
}

// Ajouter un vouch pour un utilisateur
function addVouch(userId, vouchData) {
    const vouches = loadVouches();
    if (!vouches[userId]) vouches[userId] = [];
    vouches[userId].push(vouchData);
    saveVouches(vouches);
}

// Supprimer le dernier vouch d’un utilisateur
function deleteLastVouch(userId) {
    const vouches = loadVouches();
    if (!vouches[userId] || vouches[userId].length === 0) return null;
    const removed = vouches[userId].pop();
    saveVouches(vouches);
    return removed;
}

module.exports = { loadVouches, saveVouches, addVouch, deleteLastVouch };
