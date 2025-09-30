import discord
from discord.ext import commands
from flask import Flask
import threading
import os

# ------------------------------
# Flask pour uptime
# ------------------------------
app = Flask("")

@app.route("/")
def home():
    return "Bot FastShop en ligne ✅"

def run_flask():
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))

threading.Thread(target=run_flask, daemon=True).start()

# ------------------------------
# Bot Discord
# ------------------------------
TOKEN = os.environ.get("DISCORD_TOKEN")

intents = discord.Intents.default()
intents.members = True

class MyBot(commands.Bot):
    def __init__(self):
        super().__init__(command_prefix="/", intents=intents)

    async def setup_hook(self):
        # Charger tes cogs ici
        for cog in ["commands.ping_cog", "commands.vouch_cog"]:
            try:
                await self.load_extension(cog)
                print(f"[COG] {cog} chargé ✅")
            except Exception as e:
                print(f"[COG] Erreur en chargeant {cog} : {e}")

bot = MyBot()

@bot.event
async def on_ready():
    print(f"Bot {bot.user} en ligne ! ✅")

bot.run(TOKEN)
