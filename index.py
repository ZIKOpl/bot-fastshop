import discord
from discord.ext import commands
from flask import Flask
import asyncio
import os

TOKEN = os.getenv("DISCORD_TOKEN")  # Ton token Discord dans Render Secrets
GUILD_ID = int(os.getenv("GUILD_ID"))  # Optionnel : si tu veux restreindre les slash commands à ton serveur

# ----- Flask pour Uptime Robot -----
app = Flask(__name__)

@app.route("/")
def home():
    return "Bot en ligne ✅"

# Lance Flask dans un thread séparé
import threading
def run_flask():
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 10000)))

threading.Thread(target=run_flask).start()

# ----- Bot Discord -----
intents = discord.Intents.default()
intents.message_content = True  # Nécessaire si tu veux lire le contenu des messages
bot = commands.Bot(command_prefix="/", intents=intents)

# ----- Chargement des cogs -----
COGS = ["commands.ping_cog", "commands.vouch_cog"]  # Tes cogs dans le dossier commands

async def setup_bot():
    for cog in COGS:
        await bot.load_extension(cog)

@bot.event
async def on_ready():
    print(f"{bot.user} est connecté !")

# Utilisation de setup_hook pour charger les cogs correctement
class MyBot(commands.Bot):
    async def setup_hook(self):
        for cog in COGS:
            await self.load_extension(cog)
        print("Cogs chargés ✅")

bot = MyBot(command_prefix="/", intents=intents)

# Lancement du bot
bot.run(TOKEN)
