import discord
from discord.ext import commands
from discord import app_commands

class Ping(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="ping", description="Teste la latence du bot")
    async def ping(self, interaction: discord.Interaction):
        embed = discord.Embed(
            title="🏓 Pong !",
            color=discord.Color.blue()
        )
        embed.add_field(name="Latence API", value=f"{round(self.bot.latency*1000)} ms", inline=True)
        embed.set_footer(text=f"Demandé par {interaction.user.display_name}")
        await interaction.response.send_message(embed=embed)

async def setup(bot):
    await bot.add_cog(Ping(bot))
