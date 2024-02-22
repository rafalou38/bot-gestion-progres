import { Chapter } from "$db/schemas/chapter";
import { StaffMember } from "$db/schemas/member";
import { DBProject } from "$db/schemas/project";
import { chapterStatusMessage } from "$utils/embeds/chapter";
import { ButtonInteraction, ButtonStyle, ComponentType, GuildMember, InteractionReplyOptions, MessageCreateOptions, TextChannel } from "discord.js";

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

    const { embed: baseMsg, mentions } = chapterStatusMessage(chapter, chapter.project as unknown as DBProject);
    await interaction.message.edit(
        baseMsg
    );
    const replyMsg = await interaction.message.fetch();

    const privMsg: InteractionReplyOptions = {
        ...baseMsg as InteractionReplyOptions,
        content: (chapter.project as unknown as DBProject).name,
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Link,
                        label: "Valider",
                        url: `https://discord.com/channels/${interaction.guildId}/${(chapter.project as unknown as DBProject).channel}/${replyMsg.id}`,
                    },
                ],
            },
        ],
    };

    mentions.forEach(async (mention) => {
        const member = await StaffMember.findOne({ memberID: mention });
        if (member) {
            const channel = await interaction.client.channels.fetch(member.channelID) as TextChannel;
            if (channel) {
                await channel.send(privMsg as MessageCreateOptions);
            }
        }
    });
    await interaction.reply({
        ephemeral: true,
        content: "Merci <:652923844343889920:732262582957899817>",
    });
}
