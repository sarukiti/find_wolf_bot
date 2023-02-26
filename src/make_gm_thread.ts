import { ChannelType, TextChannel, SlashCommandBuilder, Interaction } from 'discord.js'

const optionSetName = (name: string) => (option: SlashCommandBuilder) => option.setName(name);
const optionSetDescription = (description: string) => (option: SlashCommandBuilder) => option.setDescription(description);

const composeSetter = (...setters: any[]) =>
    setters.reduce((acc, setter) =>
        (option: SlashCommandBuilder) => {
            const modified = acc(option);
            return setter(modified);
        },
        (option: SlashCommandBuilder) => option
    )

const userNameN = (n: number) => optionSetName(`username${n}`);
const pleaseInputAttendant = optionSetDescription("参加するユーザーを入力してください");

export const join_member = new SlashCommandBuilder()
    .setName('start')
    .setDescription('ゲームを始めよう')
    //.addIntegerOption(option => option.setName("join_member").setDescription('参加するユーザーの人数を入力してください'))

for (let i = 1; i <= 10; i++) {
    join_member.addUserOption(composeSetter(userNameN(i), pleaseInputAttendant));
}

export const startCommandImpl = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'start') {
        for (let i = 1; interaction.options.getUser(`username${i}`)?.username !== undefined; i++) {
            const thread = await (interaction.channel as TextChannel).threads.create({
                name: `${interaction.options.getUser(`username${i}`)?.username}`,
                autoArchiveDuration: 60,
                type: ChannelType.PrivateThread,
                reason: `${interaction.options.getUser(`username${i}`)}がGMと話すためのスレッド`,
            });
            await thread.members.add(`${interaction.options.getUser(`username${i}`)?.id}`);
        }
        interaction.reply('GM連絡用スレッドを立てました')
    }
}