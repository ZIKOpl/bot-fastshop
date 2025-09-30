import discord
from discord.ext import commands
from discord import app_commands
import os
import asyncio
from flask import Flask
import threading

# ------------------------------
# Flask pour UptimeRobot
# ------------------------------
app = Flask("")

@app.route("/")
def home():
    return "Bot FastShop en ligne ✅"

def run_flask():
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))

# Thread daemon pour ne pas bloquer le bot
flask_thread = threading.Thread(target=run_flask)
flask_thread.daemon = True
flask_thread.start()

# ------------------------------
# Bot Discord
# ------------------------------
TOKEN = os.environ.get("DISCORD_TOKEN")

intents = discord.Intents.default()
intents.members = True

bot = commands.Bot(command_prefix="/", intents=intents)

# Chargement des cogs
async def load_cogs():
    for cog in ["commands.ping_cog", "commands.vouch_cog"]:
        try:
            await bot.load_extension(cog)
            print(f"[COG] {cog} chargé ✅")
        except Exception as e:
            print(f"[COG] Erreur en chargeant {cog} : {e}")

@bot.event
async def on_ready():
    print(f"Bot {bot.user} en ligne ! ✅")

# On démarre le bot sans asyncio.run
bot.loop.create_task(load_cogs())
bot.run(TOKEN)
