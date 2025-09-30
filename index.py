import discord
from discord.ext import commands
import asyncio
import os
from flask import Flask

TOKEN = os.environ.get("DISCORD_TOKEN")

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

# ------------------- LOAD COGS -------------------
async def load_cogs():
    for cog in ["vouch_cog", "ping_cog"]:
        await bot.load_extension(f"commands.{cog}")

async def main():
    await load_cogs()
    await bot.start(TOKEN)

# ------------------- FLASK PING -------------------
app = Flask("")

@app.route("/")
def home():
    return "Bot FastShop en ligne ! ✅"

# ------------------- ASYNCIO LOOP -------------------
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)
loop.create_task(main())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
