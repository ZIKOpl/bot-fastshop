import discord
from discord import app_commands
from discord.ext import commands
from datetime import datetime

ITEMS = [
    "Nitro Boost 1 Month",
    "Nitro Boost 1 Year",
    "Discord Account",
    "Server Boost 14x"
]

PAYMENTS = ["PayPal", "LTC"]

vouch_counter = 0
vouches = {}  # clé = vouch_id, valeur = dict {message, author_id}

STAFF_ROLE_NAME = "Staff"  # <-- adapte selon ton serveur

class Vouch(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    # ----- COMMAND /vouch -----
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
        global vouch_counter
        vouch_counter += 1

        acheteur_display = interaction.user.mention if anonyme == "Non" else "👤 Anonyme"
        stars = "⭐" * note
        date_str = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

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
        embed.set_thumbnail(url=interaction.user.display_avatar.url)
        embed.set_footer(text="Service proposé par FastShop • Optimisé")

        msg = await interaction.response.send_message(embed=embed)
        vouches[vouch_counter] = {"message": await interaction.original_response(), "author_id": interaction.user.id}

    # ----- COMMAND /deletevouch (Membre) -----
    @app_commands.command(name="deletevouch", description="Supprime ton propre vouch")
    @app_commands.describe(vouch_id="ID du vouch à supprimer")
    async def deletevouch(self, interaction: discord.Interaction, vouch_id: int):
        if vouch_id in vouches:
            if vouches[vouch_id]["author_id"] != interaction.user.id:
                await interaction.response.send_message("❌ Tu ne peux supprimer que tes propres vouches.", ephemeral=True)
                return
            try:
                await vouches[vouch_id]["message"].delete()
                del vouches[vouch_id]
                await interaction.response.send_message(f"✅ Ton vouch **#{vouch_id}** a été supprimé.", ephemeral=True)
            except discord.NotFound:
                await interaction.response.send_message("⚠️ Ce vouch n'existe plus.", ephemeral=True)
        else:
            await interaction.response.send_message("❌ Aucun vouch trouvé avec cet ID.", ephemeral=True)

    # ----- COMMAND /staffdeletevouch (Staff) -----
    @app_commands.command(name="staffdeletevouch", description="Supprime un vouch (Staff uniquement)")
    @app_commands.describe(vouch_id="ID du vouch à supprimer")
    async def staffdeletevouch(self, interaction: discord.Interaction, vouch_id: int):
        if not any(role.name == STAFF_ROLE_NAME for role in interaction.user.roles):
            await interaction.response.send_message("❌ Tu n'as pas la permission d'utiliser cette commande.", ephemeral=True)
            return
        if vouch_id in vouches:
            try:
                await vouches[vouch_id]["message"].delete()
                del vouches[vouch_id]
                await interaction.response.send_message(f"✅ Le vouch **#{vouch_id}** a été supprimé.", ephemeral=True)
            except discord.NotFound:
                await interaction.response.send_message("⚠️ Ce vouch n'existe plus.", ephemeral=True)
        else:
            await interaction.response.send_message("❌ Aucun vouch trouvé avec cet ID.", ephemeral=True)

    # ----- COMMAND /resetvouch (Staff) -----
    @app_commands.command(name="resetvouch", description="Réinitialise tous les vouches (Staff uniquement)")
    async def resetvouch(self, interaction: discord.Interaction):
        if not any(role.name == STAFF_ROLE_NAME for role in interaction.user.roles):
            await interaction.response.send_message("❌ Tu n'as pas la permission d'utiliser cette commande.", ephemeral=True)
            return
        for v in vouches.values():
            try:
                await v["message"].delete()
            except:
                continue
        vouches.clear()
        global vouch_counter
        vouch_counter = 0
        await interaction.response.send_message("✅ Tous les vouches ont été réinitialisés.", ephemeral=True)

async def setup(bot):
    await bot.add_cog(Vouch(bot))
