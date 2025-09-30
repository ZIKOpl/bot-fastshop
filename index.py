import os
import discord
from discord.ext import commands
from keep_alive import keep_alive  # ton serveur Flask

# === CONFIG ===
DISCORD_TOKEN = os.environ.get("DISCORD_TOKEN")

# Intents
intents = discord.Intents.default()
intents.message_content = True
intents.members = True  # nécessaire pour vérifier les rôles du staff

# Bot
bot = commands.Bot(command_prefix=".", intents=intents)

# Charger toutes les commandes du dossier commands/
def load_commands():
    for file in os.listdir("./commands"):
        if file.endswith(".py"):
            bot.load_extension(f"commands.{file[:-3]}")

@bot.event
async def on_ready():
    try:
        await bot.tree.sync()
    except Exception as e:
        print(f"Erreur sync slash commands: {e}")
    print(f"✅ Bot connecté en tant que {bot.user}")

# === LANCEMENT ===
if __name__ == "__main__":
    keep_alive()  # Lance Flask dans un thread séparé
    load_commands()  # Charge toutes les commandes
    bot.run(DISCORD_TOKEN)  # Démarre le bot
