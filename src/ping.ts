import { SlashCommandBuilder, Interaction } from 'discord.js'

export const ping = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')

export const pingCommandImpl = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
}