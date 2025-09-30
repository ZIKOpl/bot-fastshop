import os
import discord
from discord.ext import commands
from flask import Flask
import asyncio

# --- Variables ---
TOKEN = os.environ.get("DISCORD_TOKEN")  # Token Discord en variable d'environnement
PORT = int(os.environ.get("PORT", 10000))

# --- Bot Discord (slash commands) ---
intents = discord.Intents.default()
bot = commands.Bot(command_prefix="/", intents=intents)  # prefix "/" mais pour app_commands c'est secondaire

# --- Charger les cogs ---
async def load_cogs():
    for cog in ["vouch_cog", "ping_cog"]:  # fichiers dans commands/
        await bot.load_extension(f"commands.{cog}")

# --- Flask ping ---
app = Flask("")

@app.route("/")
def home():
    return "Bot FastShop en ligne ! ✅"

# --- Lancement Bot + Flask ---
async def main():
    await load_cogs()
    await bot.start(TOKEN)

# --- Boucle asyncio ---
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)
loop.create_task(main())

# --- Lancer Flask ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)
