import discord
from discord import app_commands
from discord.ext import commands
from datetime import datetime

# Liste des items disponibles (à mettre depuis ton shop)
ITEMS = [
    "Nitro Boost 1 Month",
    "Nitro Boost 1 Year",
    "Discord Account",
    "Server Boost 14x"
]

# Liste des moyens de paiement autorisés
PAYMENTS = ["PayPal", "LTC"]

# Compteur de vouch (simple, à remplacer par une DB si tu veux garder l'historique après reboot)
vouch_counter = 0

class Vouch(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="vouch", description="Donne ton avis sur un service")
    @app_commands.describe(
        vendeur="Mentionne le vendeur",
        quantite="Quantité achetée",
        item="Choisis l'item",
        prix="Prix payé (€ ou crypto)",
        moyen_de_paiement="Moyen de paiement",
        note="Note entre 1 et 5",
        commentaire="Commentaire (facultatif)",
        anonyme="Rendre le vouch anonyme ? Oui / Non"
    )
    @app_commands.choices(
        item=[discord.app_commands.Choice(name=i, value=i) for i in ITEMS],
        moyen_de_paiement=[discord.app_commands.Choice(name=p, value=p) for p in PAYMENTS],
        note=[discord.app_commands.Choice(name=str(i), value=i) for i in range(1, 6)],
        anonyme=[
            discord.app_commands.Choice(name="Oui", value="Oui"),
            discord.app_commands.Choice(name="Non", value="Non")
        ]
    )
    async def vouch(
        self, interaction: discord.Interaction,
        vendeur: discord.Member,
        quantite: int,
        item: str,
        prix: str,
        moyen_de_paiement: str,
        note: int,
        commentaire: str = "Aucun commentaire",
        anonyme: str = "Non"
    ):
        """Slash command /vouch"""
        global vouch_counter
        vouch_counter += 1

        # Gestion anonymat
        acheteur_display = interaction.user.mention if anonyme == "Non" else "👤 Anonyme"

        # Étoiles
        stars = "⭐" * note

        # Date formatée
        date_str = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

        # Embed façon fiche
        embed = discord.Embed(
            title=f"New Vouch de {interaction.user.display_name}",
            color=discord.Color.gold()
        )
        embed.add_field(name="Note", value=stars, inline=False)
        embed.add_field(name="Vendeur", value=vendeur.mention, inline=False)
        embed.add_field(name="Item vendu :", value=f"x{quantite} {item} ({prix} via {moyen_de_paiement})", inline=False)
        embed.add_field(name="Vouch N°", value=str(vouch_counter), inline=True)
        embed.add_field(name="Vouch par", value=acheteur_display, inline=True)
        embed.add_field(name="Date du vouch", value=date_str, inline=True)
        embed.add_field(name="Commentaire", value=commentaire, inline=False)

        # Avatar de l’acheteur en miniature
        embed.set_thumbnail(url=interaction.user.display_avatar.url)

        embed.set_footer(text="Service proposé par Lightvault • Optimisé")

        await interaction.response.send_message(embed=embed)

async def setup(bot):
    await bot.add_cog(Vouch(bot))
