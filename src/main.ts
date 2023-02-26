import { Client, GatewayIntentBits, Interaction, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

import { join_member, startCommandImpl } from './make_gm_thread';
import { ping, pingCommandImpl } from './ping';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
});

const commands = [
    ping,
    join_member
].map(command => command.toJSON());

const rest = new REST({version: '10'}).setToken(process.env.TOKEN??="")

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID??="", process.env.GUILD_ID??=""), {body: commands})
    .then(()=> console.log('Successfully registered application commands.'))
    .catch(console.error)

client.once('ready', async () => {
    console.log('Ready!');
    if (client.user) {
        console.log(client.user.tag);
    }
});

client.on('interactionCreate', async (interaction: Interaction) => {
    pingCommandImpl(interaction);
    startCommandImpl(interaction);
});

client.login(process.env.TOKEN);

/* 終了処理 */

process.on("exit", exitCode => {
    console.log('\ndisconnect');
    client.destroy();
});

process.on("SIGINT", () => process.exit(0));