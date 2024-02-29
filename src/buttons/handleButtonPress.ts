import { Chapter } from "$db/schemas/chapter";
import { DBProject } from "$db/schemas/project";
import { ActionType } from "$types/general";
import { chapterStatusMessage } from "$utils/embeds/chapter";
import { sendNotifications } from "$utils/gestion";
import { log } from "$utils/log";
import { ButtonInteraction, GuildMember, TextChannel } from "discord.js";

export async function handleButtonPress(interaction: ButtonInteraction) {
    if (
        !(interaction.member instanceof GuildMember) ||
        !(interaction.channel instanceof TextChannel)
    )
        return { status: "IGNORE" };
    await interaction.deferReply({
        ephemeral: true,
    });

    const command = interaction.customId.split(":")?.[0] as ActionType;
    const id = interaction.customId.split(":")?.[1];

    if (!command || !id) return { status: "IGNORE" };

    const chapter = await Chapter.findById(id);
    if (!chapter) return { status: "IGNORE" };

    switch (command) {
    case "translate":
        chapter.translated = true;
        break;
    case "check":
        chapter.checked = true;
        break;
    case "clean":
        chapter.cleaned = true;
        break;
    case "edit":
        chapter.edited = true;
        break;
    case "post":
        chapter.posted = true;
        break;
    default:
        break;
    }

    if(chapter.notifications)
        await Promise.allSettled(chapter.notifications.map(async (identifier) => {
            const [actionType, channelID, messageID] = identifier.split("-");
            if(actionType != command) return;


            const channel = await interaction.client.channels.fetch(channelID) as TextChannel;
            if (channel) {
                await channel.messages.delete(messageID);
                log(`Deleted message ${messageID} in ${channelID} because of ${command}`);
            }
        }));

    await chapter.populate("project");
    const project = chapter.project as unknown as DBProject;

    const messageOptions = chapterStatusMessage(chapter);
    const baseChannel = await interaction.client.channels.fetch(project.channel) as TextChannel;
    const baseMessage = await baseChannel?.messages.fetch(chapter.messageID);
    if(baseMessage) await baseMessage.edit(messageOptions);
    else await baseChannel?.send(messageOptions);

    await sendNotifications(interaction.client, project, chapter);

    await chapter.save();

    await interaction.editReply({
        content: "Merci <:652923844343889920:732262582957899817>",
    });
}
