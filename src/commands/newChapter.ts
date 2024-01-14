import {
    ApplicationCommandOptionType,
    Client,
    CommandInteraction,
    GuildMember,
    InteractionReplyOptions,
    TextChannel,
} from "discord.js";
import { CommandReturn, PartialApplicationCommand } from "$types/commands";
import { Project } from "$db/schemas/project";
import { Chapter } from "$db/schemas/chapter";
import { chapterStatusMessage } from "$utils/embeds/chapter";

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

    await interaction.reply(
        chapterStatusMessage(chapter, project) as InteractionReplyOptions,
    );

    return {
        status: "OK",
        label: "Uncompleted",
    };
}
