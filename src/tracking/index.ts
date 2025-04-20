import { mangaInfo as asura } from "./asura";
import { mangaInfo as galaxy } from "./galaxy";
import { mangaInfo as cypher } from "./cypher";

import { Project } from "$db/schemas/project";
import { Chapter } from "$db/schemas/chapter";
import { sleep } from "$utils";
import { context } from "$context/context";
import { Guild, TextChannel } from "discord.js";
import { chapterStatusMessage } from "$utils/embeds/chapter";
import { sendNotifications } from "$utils/gestion";

export async function checkNewChapters() {
    const projects = await Project.find();

    console.log("Checking new chapters for ", projects.length, " projects");
    for (const project of projects) {
        const url = project.vaLink;


        let fn;
        if (url) {
            if (url.includes("asuracomic.net/")) fn = asura;
            if (url.includes("cypherscans.xyz/")) fn = cypher;
            if (url.includes("mangagalaxy.me/")) fn = galaxy;
        }

        console.log("\n==> ", project.name, fn);

        if (!fn) continue;

        let lastChapter = 0;
        try {
            lastChapter = await fn(url) || 0;
        } catch (error) {
            console.error(error);
        }

        await sleep(500);

        if (lastChapter === 0) {
            console.log("No last chapter found on ", url);
            continue;
        }

        // Chapter.findOne
        // Find chapter with the highest `number`
        const result = await Chapter.find({ project: project._id }).sort({ number: -1 }).limit(1);
        const lastChapterDB = result.at(0)?.number || 0;

        if (lastChapter > lastChapterDB) {
            console.log("New chapters available", url);
            const channel = await context.client.channels.fetch(project.channel);
            if (!(channel instanceof TextChannel)) {
                console.error(`Channel ${project.channel} not found for`, project.name);
                continue;
            }

            for (let i = lastChapterDB + 1; i <= lastChapter; i++) {
                const chapter = new Chapter({
                    number: i,
                    project: project._id,
                    translated: false,
                    checked: false,
                    q_checked: false,
                    q_edited: false,
                    cleaned: false,
                    edited: false,
                    posted: false,
                    acknowledged: [],
                    messageID: "",
                });

                if (i % 10 === 0) {
                    await channel.send("** **                                trad    check     clean     edit     q_check     q_edit     post ");
                }
                const messageOptions = chapterStatusMessage(chapter);
                const sentInfoMessage = await channel.send(messageOptions);
                chapter.messageID = sentInfoMessage.id;

                await sendNotifications(context.client, project, chapter);

                await chapter.save();

                console.log("\tpushed chapter", i);
                await sleep(500);
            }
        } else {
            console.log("No new chapters", url);
        }
    }
}
// import dotenv from "dotenv";
// dotenv.config(); // load discord token from .env

// import { connectDB } from "$db/init";
// connectDB().then(() => {
//     checkNews();
// });

