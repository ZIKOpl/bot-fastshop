const fs = require("fs");
const path = require("path");

const vouchesPath = path.join(__dirname, "../vouch.json");

// Charger les vouches existants
function loadVouches() {
    if (!fs.existsSync(vouchesPath)) {
        fs.writeFileSync(vouchesPath, JSON.stringify({}, null, 2));
        return {};
    }
    return JSON.parse(fs.readFileSync(vouchesPath, "utf8"));
}

// Enregistrer les vouches
function saveVouches(data) {
    fs.writeFileSync(vouchesPath, JSON.stringify(data, null, 2));
}

// Ajouter un vouch
function addVouch(userId, vouchData) {
    const vouches = loadVouches();
    if (!vouches[userId]) vouches[userId] = [];
    vouches[userId].push(vouchData);
    saveVouches(vouches);
}

// Obtenir le nombre total de vouches (tous utilisateurs confondus)
function getVouchCount() {
    const vouches = loadVouches();
    return Object.values(vouches).reduce((acc, arr) => acc + arr.length, 0);
}

// Supprimer le dernier vouch d'un utilisateur
function deleteLastVouch(userId) {
    const vouches = loadVouches();
    if (!vouches[userId] || vouches[userId].length === 0) {
        return { success: false };
    }

    const lastVouch = vouches[userId].pop();
    saveVouches(vouches);

    return { success: true, messageId: lastVouch.messageId };
}

// Récupérer tous les vouches pour un vendeur spécifique
function getVouchesForVendeur(vendeurId) {
    const vouches = loadVouches();
    const allUserVouches = Object.values(vouches).flat();
    return allUserVouches.filter(v => v.vendeur_id === vendeurId);
}

module.exports = {
    addVouch,
    getVouchCount,
    deleteLastVouch,
    getVouchesForVendeur
};
