import os
import asyncio
import discord
from discord.ext import commands
from flask_keepalive import keep_alive

# === CONFIG ===
DISCORD_TOKEN = os.environ.get("DISCORD_TOKEN")

# Intents
intents = discord.Intents.default()
bot = commands.Bot(command_prefix=".", intents=intents)

# Charger toutes les commandes du dossier commands/
async def load_commands():
    for file in os.listdir("./commands"):
        if file.endswith(".py"):
            await bot.load_extension(f"commands.{file[:-3]}")

@bot.event
async def on_ready():
    await bot.tree.sync()
    print(f"✅ Bot connecté en tant que {bot.user}")

async def main():
    async with bot:
        await load_commands()
        await bot.start(DISCORD_TOKEN)

if __name__ == "__main__":
    keep_alive()  # Flask pour Render
    asyncio.run(main())
