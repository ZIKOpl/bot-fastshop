import discord
from discord.ext import commands
from flask import Flask
import asyncio
import os

TOKEN = os.environ.get("DISCORD_TOKEN")  # Mets ton token dans Render -> Environment

bot = commands.Bot(command_prefix="!", intents=discord.Intents.all())

# ----- Flask pour Render -----
app = Flask("")

@app.route("/")
def home():
    return "Bot FastShop en ligne !"

def run():
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))

# ----- Chargement des cogs -----
async def load_cogs():
    for cog in ["vouch_cog", "ping_cog"]:
        await bot.load_extension(f"commands.{cog}")

async def main():
    await load_cogs()
    await bot.start(TOKEN)

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.create_task(main())
    run()
