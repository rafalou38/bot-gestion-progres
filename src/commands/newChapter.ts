import {
    ApplicationCommandOptionType,
    ButtonStyle,
    Client,
    CommandInteraction,
    ComponentType,
    GuildMember,
    InteractionReplyOptions,
    MessageCreateOptions,
    MessagePayload,
    TextChannel,
} from "discord.js";
import { CommandReturn, PartialApplicationCommand } from "$types/commands";
import { Project } from "$db/schemas/project";
import { Chapter } from "$db/schemas/chapter";
import { chapterStatusMessage } from "$utils/embeds/chapter";
import { StaffMember } from "$db/schemas/member";

export const subCommand = false;
export const data: PartialApplicationCommand = {
    name: "nouveau-chapitre",
    description: "Démarre la traduction d'un nouveau chapitre.",
    options: [
        {
            name: "numéro",
            description: "Le numéro du chapitre.",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],
};

export async function run(
    client: Client,
    interaction: CommandInteraction,
): Promise<CommandReturn> {
    if (
        !interaction.isCommand() ||
        !(interaction.member instanceof GuildMember) ||
        !(interaction.channel instanceof TextChannel)
    )
        return { status: "IGNORE" };

    const channel = interaction.channel;
    const project = await Project.findOne({ channel: channel.id });
    if (!project) {
        await interaction.reply({
            ephemeral: true,
            embeds: [
                {
                    title: "Erreur",
                    description:
                        "Place toi dans le salon du projet avant de lancer cette commande.",
                    color: 0xff0000,
                },
            ],
        });
        return {
            status: "ERROR",
            label: "NoProject",
        };
    }

    const numberRaw = interaction.options.get("numéro", true);
    // @ts-ignore
    const number = parseFloat(numberRaw.value);

    const chapter = new Chapter({
        number: number,
        project: project._id,
        translated: false,
        checked: false,
        cleaned: false,
        edited: false,
        posted: false,
    });

    await chapter.save();
    const { embed: baseMsg, mentions } = chapterStatusMessage(chapter, project);
    const reply = await interaction.reply(
        baseMsg as InteractionReplyOptions
    );

    const replyMsg = await reply.fetch();

    const privMsg: InteractionReplyOptions = {
        ...baseMsg as InteractionReplyOptions,
        content: project.name,
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Link,
                        label: "Valider",
                        url: `https://discord.com/channels/${interaction.guildId}/${project.channel}/${replyMsg.id}`,
                    },
                ],
            },
        ],
    };

    mentions.forEach(async (mention) => {
        const member = await StaffMember.findOne({ memberID: mention });
        if (member) {
            const channel = await client.channels.fetch(member.channelID) as TextChannel;
            if (channel) {
                await channel.send(privMsg as MessageCreateOptions);
            }
        }
    });

    return {
        status: "OK",
        label: "Uncompleted",
    };
}
