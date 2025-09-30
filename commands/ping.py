import discord
from discord import app_commands
from discord.ext import commands
from datetime import datetime

class Ping(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="ping", description="Teste la latence du bot")
    async def ping(self, interaction: discord.Interaction):
        api_latency = round(self.bot.latency * 1000)  # Latence API en ms
        ws_latency = round(self.bot.latency * 1000)   # Discord.py n'a pas de latence WS séparée
        # Tu peux ajuster WS si tu as une autre méthode

        embed = discord.Embed(
            title="🏓 Pong !",
            color=discord.Color.blue()
        )
        embed.add_field(name="Latence API", value=f"{api_latency} ms", inline=True)
        embed.add_field(name="Latence WebSocket", value=f"{ws_latency} ms", inline=True)
        embed.set_footer(text=f"Demandé par {interaction.user.display_name} • Aujourd'hui à {datetime.now().strftime('%H:%M')}")

        await interaction.response.send_message(embed=embed, ephemeral=False)

# ----- SETUP -----
async def setup(bot):
    await bot.add_cog(Ping(bot))
