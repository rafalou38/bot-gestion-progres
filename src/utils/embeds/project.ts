import { IProject } from "$db/schemas/project";
import { APIEmbed } from "discord.js";

export function projectConfigEmbed(project: IProject): APIEmbed {
    return {
        title: `Configuration de ${project.name}`,
        color: 0x00ff00,
        description: `
**Salon:** <#${project.channel}>

**Traducteurs:**
${project.trads.map((t) => `• <@${t}>`).join("\n")}

**Checkeurs:**
${project.checks.map((t) => `• <@${t}>`).join("\n")}

**Cleaners:**
${project.cleans.map((t) => `• <@${t}>`).join("\n")}

**Editeurs:**
${project.edits.map((t) => `• <@${t}>`).join("\n")}

**Posteurs:**
${project.poster.map((t) => `• <@${t}>`).join("\n")}
`.trim(),
    };
}
