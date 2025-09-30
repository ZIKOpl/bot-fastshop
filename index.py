import discord
from discord.ext import commands
from discord import app_commands
import asyncio
from flask import Flask
import threading
import os

# ----- CONFIG -----
TOKEN = os.environ.get("DISCORD_TOKEN")  # Mets ton token dans les secrets de Replit
GUILD_ID = int(os.environ.get("GUILD_ID", 0))  # Optionnel pour les tests, sinon None

# ----- BOT -----
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

# ----- COG -----
async def load_cogs():
    for cog in ["vouch_cog"]:  # ton fichier vouch doit s'appeler vouch_cog.py
        await bot.load_extension(f"commands.{cog}")

# ----- EVENT READY -----
@bot.event
async def on_ready():
    print(f"{bot.user} est connecté !")
    try:
        await bot.tree.sync(guild=discord.Object(id=GUILD_ID) if GUILD_ID else None)
        print("Commandes slash synchronisées !")
    except Exception as e:
        print(f"Erreur sync slash commands: {e}")

# ----- FLASK POUR MAINTENIR LE BOT EN VIE -----
app = Flask("")

@app.route("/")
def home():
    return "Bot FastShop est en ligne !"

def run_flask():
    app.run(host="0.0.0.0", port=8080)

# ----- THREADING POUR FLASK -----
flask_thread = threading.Thread(target=run_flask)
flask_thread.start()

# ----- MAIN -----
async def main():
    await load_cogs()
    await bot.start(TOKEN)

asyncio.run(main())
