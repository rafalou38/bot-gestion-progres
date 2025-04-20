import { DBChapter, IChapter } from "$db/schemas/chapter";
import { DBProject, IProject } from "$db/schemas/project";
import { APIMessageComponentEmoji, ButtonStyle, Client, ComponentType, TextChannel } from "discord.js";
import { chapterPrivateActions } from "./embeds/chapter";
import { StaffMember } from "$db/schemas/member";

export function getNextTasks(chapter: IChapter, project: IProject) {
    const tasks = {
        translate: [] as string[],
        check: [] as string[],
        q_check: [] as string[],
        clean: [] as string[],
        edit: [] as string[],
        post: [] as string[],
    };

    if (!chapter.translated) {
        tasks.translate = project.trads;
    } else if (!chapter.checked) {
        tasks.check = project.checks;
    }

    if (!chapter.cleaned) {
        tasks.clean = project.cleans;
    }

    if (chapter.checked && chapter.cleaned) {
        if (!chapter.edited) {
            tasks.edit = project.edits;
        } else if (!chapter.q_checked && project.q_checks?.length > 0) {
            tasks.q_check = project.q_checks;
        }
        else if (!chapter.posted) {
            tasks.post = project.poster;
        }
    }

    return tasks;
}

export async function sendNotifications(client: Client, project: DBProject, chapter: DBChapter) {
    const actions = chapterPrivateActions(chapter, project);
    await Promise.allSettled(actions.map(async (action) => {
        const member = await StaffMember.findOne({ memberID: action.id });
        if (member) {
            const channel = await client.channels.fetch(member.channelID) as TextChannel;
            if (channel && !chapter.acknowledged.includes(action.action + "-" + action.id)) {
                const message = await channel.send({
                    content: action.message,
                    components: [
                        {

                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.Button,
                                    style: ButtonStyle.Success,
                                    emoji: "<:652923835036860447:732262583176003655>" as APIMessageComponentEmoji,
                                    label: "FINI",
                                    custom_id: `${action.action}:${chapter.id}`,
                                }
                            ]
                        }
                    ]
                });
                // For sending notif once
                chapter.acknowledged.push(action.action + "-" + action.id);
                // for deleting notification after
                chapter.notifications.push(action.action + "-" + channel.id + "-" + message.id);
            }
        }
    }));

}