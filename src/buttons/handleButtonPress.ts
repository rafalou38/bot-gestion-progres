import { Chapter } from "$db/schemas/chapter";
import { DBProject } from "$db/schemas/project";
import { chapterStatusMessage } from "$utils/embeds/chapter";
import { ButtonInteraction, GuildMember, TextChannel } from "discord.js";


export async function handleButtonPress(interaction: ButtonInteraction) {
    if (
        !(interaction.member instanceof GuildMember) ||
        !(interaction.channel instanceof TextChannel)
    )
        return { status: "IGNORE" };

    const command = interaction.customId.split(":")?.[0];
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

    await chapter.save();

    await chapter.populate("project");
    
    await interaction.message.edit(chapterStatusMessage(chapter, chapter.project as unknown as DBProject));
    await interaction.reply({
        ephemeral: true,
        content: "Merci <:652923844343889920:732262582957899817>",
    });
}
