import discord
from discord import app_commands
from discord.ext import commands

# Liste des items disponibles (à mettre depuis ton shop)
ITEMS = [
    "Nitro Boost 1 Month",
    "Nitro Boost 1 Year",
    "Discord Account",
    "Server Boost 14x"
]

# Liste des moyens de paiement autorisés
PAYMENTS = ["PayPal", "LTC"]

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

        # Gestion anonymat
        vendeur_display = vendeur.mention if anonyme == "Non" else "👤 Anonyme"

        # Étoiles
        stars = "⭐" * note

        embed = discord.Embed(
            title=f"📝 Nouveau Vouch",
            color=discord.Color.gold()
        )
        embed.add_field(name="👤 Vendeur", value=vendeur_display, inline=True)
        embed.add_field(name="📦 Quantité", value=str(quantite), inline=True)
        embed.add_field(name="🎁 Item", value=item, inline=True)
        embed.add_field(name="💰 Prix", value=prix, inline=True)
        embed.add_field(name="💳 Paiement", value=moyen_de_paiement, inline=True)
        embed.add_field(name="⭐ Note", value=stars, inline=False)
        embed.add_field(name="💬 Commentaire", value=commentaire, inline=False)

        embed.set_footer(text="Système de Vouch • Optimisé")

        await interaction.response.send_message(embed=embed)

async def setup(bot):
    await bot.add_cog(Vouch(bot))
