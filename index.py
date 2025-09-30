import os
import discord
from discord.ext import commands
import asyncio
from keep_alive import keep_alive  # ton serveur Flask
import os

# === CONFIG ===
DISCORD_TOKEN = os.environ.get("DISCORD_TOKEN")

# Intents
intents = discord.Intents.default()
intents.message_content = True
intents.members = True  # nécessaire pour vérifier les rôles staff

# Bot
bot = commands.Bot(command_prefix=".", intents=intents)

# Charger toutes les commandes du dossier commands/ de façon asynchrone
async def load_commands():
    for file in os.listdir("./commands"):
        if file.endswith(".py"):
            await bot.load_extension(f"commands.{file[:-3]}")

@bot.event
async def on_ready():
    try:
        await bot.tree.sync()
    except Exception as e:
        print(f"Erreur sync slash commands: {e}")
    print(f"✅ Bot connecté en tant que {bot.user}")

# Fonction principale
async def main():
    keep_alive()  # Lance Flask pour Render
    await load_commands()  # Charge les cogs
    await bot.start(DISCORD_TOKEN)  # Démarre le bot

if __name__ == "__main__":
    # Lance le bot dans asyncio
    asyncio.run(main())
