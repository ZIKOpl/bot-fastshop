import discord
from discord.ext import commands
from discord import app_commands
import time

class PingCog(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="ping", description="Test de latence du bot")
    async def ping(self, interaction: discord.Interaction):
        start = time.perf_counter()
        msg = await interaction.response.send_message("🏓 Pong !", ephemeral=False)
        end = time.perf_counter()
        latency_api = round((end - start) * 1000)
        latency_ws = round(self.bot.latency * 1000)

        embed = discord.Embed(
            title="🏓 Pong !",
            description=f"Latence API : {latency_api} ms\nLatence WebSocket : {latency_ws} ms",
            color=discord.Color.blue()
        )
        embed.set_footer(text=f"Demandé par {interaction.user.display_name}")
        await interaction.edit_original_response(embed=embed)

async def setup(bot):
    await bot.add_cog(PingCog(bot))
