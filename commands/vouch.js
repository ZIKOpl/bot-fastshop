const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('Donne ton avis sur un service')
        .addUserOption(option =>
            option.setName('vendeur')
                  .setDescription('Mentionne le vendeur')
                  .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('quantite')
                  .setDescription('Quantité achetée')
                  .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('item')
                  .setDescription("Choisis l'item")
                  .setRequired(true)
                  .addChoices(
                      { name: 'Nitro Boost 1 Month', value: 'Nitro Boost 1 Month' },
                      { name: 'Nitro Basic 1 Month', value: 'Nitro Basic 1 Month' },
                      { name: 'Discord Account', value: 'Discord Account' },
                      { name: 'Server Boost', value: 'Server Boost' },
                      { name: 'Message Réaction', value: 'Message Réaction' },
                      { name: 'Décoration', value: 'Décoration' }
                  )
        )
        .addStringOption(option =>
            option.setName('prix')
                  .setDescription('Prix payé')
                  .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('moyen_de_paiement')
                  .setDescription('Moyen de paiement')
                  .setRequired(true)
                  .addChoices(
                      { name: 'Paypal', value: 'Paypal' },
                      { name: 'Carte Bancaire', value: 'Carte Bancaire' },
                      { name: 'Autre', value: 'Autre' }
                  )
        )
        .addIntegerOption(option =>
            option.setName('note')
                  .setDescription('Note 1-5')
                  .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('commentaire')
                  .setDescription('Commentaire')
                  .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('anonyme')
                  .setDescription('Anonyme ?')
                  .setRequired(true)
                  .addChoices(
                      { name: 'Oui', value: 'oui' },
                      { name: 'Non', value: 'non' }
                  )
        ),
    async execute(interaction) {
        const vendeur = interaction.options.getUser('vendeur');
        const quantite = interaction.options.getInteger('quantite');
        const item = interaction.options.getString('item');
        const prix = interaction.options.getString('prix');
        const moyen = interaction.options.getString('moyen_de_paiement');
        const note = interaction.options.getInteger('note');
        const commentaire = interaction.options.getString('commentaire') || 'Aucun';
        const anonyme = interaction.options.getString('anonyme') === 'oui';

        const user = anonyme ? 'Anonyme' : interaction.user.username;

        // Ici tu peux envoyer le vouch dans un channel spécifique
        const channel = interaction.guild.channels.cache.get('1417943146653810859'); // Remplace par ton channel
        if (!channel) return interaction.reply({ content: "Channel introuvable.", ephemeral: true });

        await channel.send({
            content: `**Vouch par ${user}**\nVendeur: ${vendeur}\nQuantité: ${quantite}\nItem: ${item}\nPrix: ${prix}\nMoyen de paiement: ${moyen}\nNote: ${note}\nCommentaire: ${commentaire}`
        });

        await interaction.reply({ content: "Ton vouch a été envoyé ! ✅", ephemeral: true });
    }
};
