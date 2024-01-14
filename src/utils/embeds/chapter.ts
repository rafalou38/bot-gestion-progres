import { DBChapter } from "$db/schemas/chapter";
import { DBProject } from "$db/schemas/project";
import { APIMessageActionRowComponent, APIMessageComponentEmoji, ButtonStyle, ComponentType, InteractionReplyOptions, MessageEditOptions } from "discord.js";

export function chapterStatusMessage(chapter: DBChapter, project: DBProject): MessageEditOptions {
    const done = "<:2996_Green_Veryfication:790247000519344129>";
    const todo = "<:652923844352278584:732262582856974438>";
    const waiting = "<:KannaWhat:730033275892137996>";

    const buttons: APIMessageActionRowComponent[] = [];

    let mentions = "";

    if (!chapter.translated) {
        buttons.push({
            type: ComponentType.Button,
            style: ButtonStyle.Success,
            emoji: "<:652923835036860447:732262583176003655>" as APIMessageComponentEmoji,
            label: "TRADUIT",
            custom_id: `translate:${chapter.id}`,
        });
        mentions += project.trads.map((trad) => `<@${trad}>`).join(" ") + " Tu peux trad ce chapitre.\n";
    } else if (!chapter.checked) {
        buttons.push({
            type: ComponentType.Button,
            style: ButtonStyle.Success,
            emoji: "<:652923835036860447:732262583176003655>" as APIMessageComponentEmoji,
            label: "CHECK",
            custom_id: `check:${chapter.id}`,
        });
        mentions += project.checks.map((cheque) => `<@${cheque}>`).join(" ") + " Tu peux check ce chapitre.\n";
    }

    if (!chapter.cleaned) {
        buttons.push({
            type: ComponentType.Button,
            style: ButtonStyle.Success,
            emoji: "<:652923835036860447:732262583176003655>" as APIMessageComponentEmoji,
            label: "CLEAN",
            custom_id: `clean:${chapter.id}`,
        });
        mentions += project.cleans.map((clean) => `<@${clean}>`).join(" ") + " Tu peux clean ce chapitre.\n";
    }

    if (chapter.checked && chapter.cleaned) {
        if (!chapter.edited) {
            buttons.push({
                type: ComponentType.Button,
                style: ButtonStyle.Success,
                emoji: "<:652923835036860447:732262583176003655>" as APIMessageComponentEmoji,
                label: "EDIT",
                custom_id: `edit:${chapter.id}`,
            });
            mentions += project.edits.map((edit) => `<@${edit}>`).join(" ") + " Tu peux edit ce chapitre.\n";
        } else if (!chapter.posted) {
            buttons.push({
                type: ComponentType.Button,
                style: ButtonStyle.Success,
                label: "POST",
                emoji: "<:652923835036860447:732262583176003655>" as APIMessageComponentEmoji,
                custom_id: `post:${chapter.id}`,
            });
            mentions += project.poster.map((poster) => `<@${poster}>`).join(" ") + " Tu peux post ce chapitre.\n";
        }
    }

    return {
        content: mentions,
        embeds: [{
            title: `Chapitre: **${chapter.number}**`,
            color: chapter.posted ? 0x00ff00 : 0x34d5eb,
            description: `
Trad:   ${chapter.translated ? done : todo}
Check: ${chapter.translated ? chapter.checked ? done : todo : waiting}
Clean: ${chapter.cleaned ? done : todo}
Edit:   ${chapter.checked && chapter.cleaned ? chapter.edited ? done : todo : waiting}
Post:   ${chapter.edited ? chapter.posted ? done : todo : waiting}
`.trim(),
        }],
        components: buttons.length > 0 ? [
            {
                type: ComponentType.ActionRow,
                components: buttons
            }
        ] : [],
    };
}