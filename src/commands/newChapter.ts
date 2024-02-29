import {
    ApplicationCommandOptionType,
    Client,
    CommandInteraction,
    GuildMember,
    TextChannel,
} from "discord.js";
import { CommandReturn, PartialApplicationCommand } from "$types/commands";
import { Project } from "$db/schemas/project";
import { Chapter } from "$db/schemas/chapter";
import { chapterStatusMessage } from "$utils/embeds/chapter";
import { sendNotifications } from "$utils/gestion";

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
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.channel;
    const project = await Project.findOne({ channel: channel.id });
    if (!project) {
        await interaction.editReply({
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
        acknowledged: [],
        messageID: "",
    });

    if(number % 10 === 0) {
        await channel.send("** **                                trad    check     clean     edit     post ");
    }
    const messageOptions = chapterStatusMessage(chapter);
    const sentInfoMessage = await channel.send(messageOptions);
    chapter.messageID = sentInfoMessage.id;

    await sendNotifications(client, project, chapter);

    await chapter.save();

    interaction.editReply({
        content: "Chapitre enregisté.",
    });

    return {
        status: "OK",
        label: "Done",
    };
}
