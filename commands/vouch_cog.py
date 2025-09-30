import discord
from discord.ext import commands
from discord import app_commands
import json
import os
from datetime import datetime

# ---------- CONFIG ----------
STAFF_ROLE_ID = 1418652782625296445  # Remplace par ton rôle staff
VOUCH_FILE = "vouches.json"

ITEMS = ["Nitro Boost 1 Month", "Nitro Basic 1 Month", "Discord Account", "Server Boost", "Message Réaction", "Décoration"]
PAYMENTS = ["PayPal", "LTC"]

# ---------- CHARGEMENT ----------
if os.path.exists(VOUCH_FILE):
    with open(VOUCH_FILE, "r") as f:
        vouches = json.load(f)
        vouches = {int(k): v for k, v in vouches.items()}
        vouch_counter = max(vouches.keys(), default=0)
else:
    vouches = {}
    vouch_counter = 0

def save_vouches():
    with open(VOUCH_FILE, "w") as f:
        json.dump(vouches, f, indent=4)

# ---------- COG ----------
class VouchCog(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    # --------- AJOUTER VOUCH ---------
    @app_commands.command(name="vouch", description="Ajouter un vouch")
    @app_commands.describe(
        vendeur="Mentionne le vendeur",
        quantite="Quantité achetée",
        item="Choisis l'item",
        prix="Prix payé",
        moyen_de_paiement="Moyen de paiement",
        note="Note entre 1 et 5",
        commentaire="Commentaire facultatif",
        anonyme="Rendre anonyme ? Oui/Non"
    )
    @app_commands.choices(
        item=[app_commands.Choice(name=i, value=i) for i in ITEMS],
        moyen_de_paiement=[app_commands.Choice(name=p, value=p) for p in PAYMENTS],
        note=[app_commands.Choice(name=str(i), value=i) for i in range(1,6)],
        anonyme=[app_commands.Choice(name="Oui", value="Oui"), app_commands.Choice(name="Non", value="Non")]
    )
    async def vouch(self, interaction: discord.Interaction, vendeur: discord.Member, quantite: int, item: str,
                    prix: str, moyen_de_paiement: str, note: int, commentaire: str = "Aucun commentaire",
                    anonyme: str = "Non"):

        global vouch_counter
        vouch_counter += 1

        acheteur_display = interaction.user.mention if anonyme == "Non" else "👤 Anonyme"
        stars = "⭐" * note
        date_str = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

        embed = discord.Embed(
            title=f"🏆 Nouveau Vouch",
            color=discord.Color.blue()
        )
        embed.add_field(name="Note", value=stars, inline=False)
        embed.add_field(name="Vendeur", value=vendeur.mention, inline=False)
        embed.add_field(name="Item vendu", value=f"x{quantite} {item} ({prix} via {moyen_de_paiement})", inline=False)
        embed.add_field(name="Vouch N°", value=str(vouch_counter), inline=True)
        embed.add_field(name="Vouch par", value=acheteur_display, inline=True)
        embed.add_field(name="Date", value=date_str, inline=True)
        embed.add_field(name="Commentaire", value=commentaire, inline=False)
        embed.set_thumbnail(url=interaction.user.display_avatar.url)
        embed.set_footer(text="FastShop • Optimisé")

        await interaction.response.send_message(embed=embed)
        msg = await interaction.original_response()

        vouches[vouch_counter] = {
            "message_id": msg.id,
            "channel_id": msg.channel.id,
            "author_id": interaction.user.id,
            "vendeur_id": vendeur.id,
            "quantite": quantite,
            "item": item,
            "prix": prix,
            "paiement": moyen_de_paiement,
            "note": note,
            "commentaire": commentaire,
            "anonyme": anonyme,
            "date": date_str
        }
        save_vouches()

    # --------- SUPPRIMER VOUCH ---------
    @app_commands.command(name="deletevouch", description="Supprime un vouch (staff uniquement)")
    @app_commands.describe(vouch_id="ID du vouch à supprimer")
    async def deletevouch(self, interaction: discord.Interaction, vouch_id: int):
        if not any(role.id == STAFF_ROLE_ID for role in interaction.user.roles):
            await interaction.response.send_message("❌ Tu n'as pas la permission !", ephemeral=True)
            return

        if vouch_id not in vouches:
            await interaction.response.send_message("❌ Vouch introuvable !", ephemeral=True)
            return

        try:
            channel = self.bot.get_channel(vouches[vouch_id]["channel_id"])
            msg = await channel.fetch_message(vouches[vouch_id]["message_id"])
            await msg.delete()
        except:
            pass

        del vouches[vouch_id]
        save_vouches()
        await interaction.response.send_message(f"✅ Vouch {vouch_id} supprimé.", ephemeral=True)

    # --------- EDIT VOUCH ---------
    @app_commands.command(name="editvouch", description="Édite un vouch (staff uniquement)")
    @app_commands.describe(vouch_id="ID du vouch", commentaire="Nouveau commentaire")
    async def editvouch(self, interaction: discord.Interaction, vouch_id: int, commentaire: str):
        if not any(role.id == STAFF_ROLE_ID for role in interaction.user.roles):
            await interaction.response.send_message("❌ Tu n'as pas la permission !", ephemeral=True)
            return

        if vouch_id not in vouches:
            await interaction.response.send_message("❌ Vouch introuvable !", ephemeral=True)
            return

        vouches[vouch_id]["commentaire"] = commentaire
        save_vouches()
        await interaction.response.send_message(f"✅ Vouch {vouch_id} édité.", ephemeral=True)

    # --------- LISTE DES VOUCHES ---------
    @app_commands.command(name="vouches", description="Liste tous les vouches")
    async def vouches_list(self, interaction: discord.Interaction):
        if not vouches:
            await interaction.response.send_message("Aucun vouch enregistré.", ephemeral=True)
            return

        msg_list = []
        for v_id, v in vouches.items():
            note = "⭐" * v["note"]
            msg_list.append(f"#{v_id} - {note} - {v['item']} - Par {'👤 Anonyme' if v['anonyme']=='Oui' else f'<@{v['author_id']}>'}")

        embed = discord.Embed(title="📜 Liste des vouches", description="\n".join(msg_list), color=discord.Color.green())
        await interaction.response.send_message(embed=embed, ephemeral=True)

# ---------- SETUP ----------
async def setup(bot: commands.Bot):
    await bot.add_cog(VouchCog(bot))
