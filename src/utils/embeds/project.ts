import { IProject } from "$db/schemas/project";
import { APIEmbed } from "discord.js";

export function projectConfigEmbed(project: IProject): APIEmbed  {
    return {
        title: `Configuration de ${project.name}`,
        color: 0x00ff00,
        description: `
**Channel submission:** ${project.channelSubmit}
**Channel task:** ${project.channelTask}

**Traducteurs:**
${project.trads.map((t) => `• <@&${t}>`).join("\n")}

**Checkers:**
${project.checks.map((t) => `• <@&${t}>`).join("\n")}

**Cleaners:**
${project.cleans.map((t) => `• <@&${t}>`).join("\n")}

**Editors:**
${project.edits.map((t) => `• <@&${t}>`).join("\n")}

**Posteur:**
${project.poster.map((t) => `• <@&${t}>`).join("\n")}
`.trim()
    };
}