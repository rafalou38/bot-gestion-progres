import { IChapter } from "$db/schemas/chapter";
import { IProject } from "$db/schemas/project";
import { ActionType } from "$types/general";
import { getNextTasks } from "$utils/gestion";
import {
    MessageCreateOptions,
    MessageEditOptions,
} from "discord.js";

export function chapterStatusMessage(
    chapter: IChapter
): MessageCreateOptions & MessageEditOptions {
    const done = "<:2996_Green_Veryfication:790247000519344129>";
    const todo = "<:652923844352278584:732262582856974438>";
    const waiting = "<:KannaWhat:730033275892137996>";

    let content = "chapitre " + String(chapter.number).padStart(4, "0");

    content += "		" + (chapter.translated ? done : todo);
    content += "		" + (chapter.translated ? (chapter.checked ? done : todo) : waiting);
    content += "		" + (chapter.cleaned ? done : todo);
    content += "		" + ((chapter.checked && chapter.cleaned) ? (chapter.edited ? done : todo) : waiting);
    content += "		" + ((chapter.edited) ? (chapter.posted ? done : todo) : waiting);

    console.log(content);

    return {
        content,
    };
}


export function chapterPrivateActions(chapter: IChapter, project: IProject) {
    const tasks = getNextTasks(chapter, project);

    const messages: {
        id: string;
        action: ActionType;
        message: string;
    }[] = [];


    for (const id of tasks.check) {
        messages.push({ id, action: "check", message: `__**${project.name}**__: Tu peux t'occuper du **check** du chapitre **${chapter.number}**. <@${id}>` });
    }

    for (const id of tasks.translate) {
        messages.push({ id, action: "translate", message: `__**${project.name}**__: Tu peux t'occuper de la **traduction** du chapitre **${chapter.number}**. <@${id}>` });
    }

    for (const id of tasks.clean) {
        messages.push({ id, action: "clean", message: `__**${project.name}**__: Tu peux t'occuper du **clean** du chapitre **${chapter.number}**. <@${id}>` });
    }

    for (const id of tasks.edit) {
        messages.push({ id, action: "edit", message: `__**${project.name}**__: Tu peux t'occuper de l'**édit** du chapitre **${chapter.number}**. <@${id}>` });
    }

    for (const id of tasks.post) {
        messages.push({ id, action: "post", message: `__**${project.name}**__: Ça y est, tu peux **publier** le chapitre **${chapter.number}**. <@${id}>` });
    }


    return messages;
}
