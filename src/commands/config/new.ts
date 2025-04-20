import { Client, CommandInteraction, GuildMember, Message } from "discord.js";
import {
    CommandReturn,
    PartialApplicationCommandSubCommand,
} from "$types/commands";
import { askTextInteraction } from "$utils/questions/askText";
import { Project } from "$db/schemas/project";
import { projectConfigEmbed } from "$utils/embeds/project";

export const subCommand = false;
export const data: PartialApplicationCommandSubCommand = {
    name: "new",
    description: "Configure un nouveau projet.",
    options: [],
};

export async function run(
    client: Client,
    interaction: CommandInteraction,
): Promise<CommandReturn> {
    if (
        !interaction.isCommand() ||
        !(interaction.member instanceof GuildMember)
    )
        return { status: "IGNORE" };

    const authorID = interaction.member.id;
    const authorCheck = (m: Message) => m.member?.id == authorID;
    const includesChannelCheck = (m: Message) => m.mentions.channels.first();
    const includeRoleCheck = (m: Message) => m.mentions.roles.first();
    const includesMemberCheck = (m: Message) => m.mentions.members?.first();

    await interaction.reply({
        content: "Configuration d'un nouveau projet...",
    });

    collect: {
        const name = (
            await askTextInteraction(
                interaction,
                1000 * 60 * 5,
                "Quel est le nom du projet ?",
                true,
                authorCheck,
            )
        )?.content;

        const channel = (
            await askTextInteraction(
                interaction,
                1000 * 60 * 5,
                "Quel est le salon du projet ?",
                true,
                (m) => authorCheck(m) && !!includesChannelCheck(m),
            )
        )?.mentions.channels.first()?.id;
        if (!channel) break collect;

        const vaLink = (
            await askTextInteraction(
                interaction,
                1000 * 60 * 5,
                "Lien de la VA :",
                true,
                authorCheck,
            )
        )?.content;
        if (!vaLink) break collect;
    
        const pcloudLink = (
            await askTextInteraction(
                interaction,
                1000 * 60 * 5,
                "Lien du Pcloud (version protégée) :",
                true,
                authorCheck,
            )
        )?.content;
        if (!pcloudLink) break collect;

        const membersTrad = (
            await askTextInteraction(
                interaction,
                1000 * 60 * 5,
                "Qui sont les traducteurs ?",
                true,
                (m) => authorCheck(m) && !!includesMemberCheck(m),
            )
        )?.mentions.members?.map((m) => m.id);
        if (!membersTrad || membersTrad.length == 0) break collect;

        const membersCheck = (
            await askTextInteraction(
                interaction,
                1000 * 60 * 5,
                "Qui sont les checkers ?",
                true,
                (m) => authorCheck(m) && !!includesMemberCheck(m),
            )
        )?.mentions.members?.map((m) => m.id);
        if (!membersCheck || membersCheck.length == 0) break collect;
        const membersClean = (
            await askTextInteraction(
                interaction,
                1000 * 60 * 5,
                "Qui sont les cleaners ?",
                true,
                (m) => authorCheck(m) && !!includesMemberCheck(m),
            )
        )?.mentions.members?.map((m) => m.id);
        if (!membersClean || membersClean.length == 0) break collect;
        const membersEdit = (
            await askTextInteraction(
                interaction,
                1000 * 60 * 5,
                "Qui sont les éditeurs ?",
                true,
                (m) => authorCheck(m) && !!includesMemberCheck(m),
            )
        )?.mentions.members?.map((m) => m.id);
        if (!membersEdit || membersEdit.length == 0) break collect;

        const membersQCheck = (
            await askTextInteraction(
                interaction,
                1000 * 60 * 5,
                "Qui doit faire le q check ?",
                true,
                (m) => authorCheck(m) && !!includesMemberCheck(m),
            )
        )?.mentions.members?.map((m) => m.id);
        if (!membersQCheck || membersQCheck.length == 0) break collect;

        const membersQEdit = (
            await askTextInteraction(
                interaction,
                1000 * 60 * 5,
                "Qui doit faire le q edit ?",
                true,
                (m) => authorCheck(m) && !!includesMemberCheck(m),
            )
        )?.mentions.members?.map((m) => m.id);
        if (!membersQEdit || membersQEdit.length == 0) break collect;

        const membersPost = (
            await askTextInteraction(
                interaction,
                1000 * 60 * 5,
                "Qui doit poster les chapitres ?",
                true,
                (m) => authorCheck(m) && !!includesMemberCheck(m),
            )
        )?.mentions.members?.map((m) => m.id);
        if (!membersPost || membersPost.length == 0) break collect;

        const project = await new Project({
            name: name,
            channel,
            vaLink: vaLink,
            pcloudLink: pcloudLink,
            trads: membersTrad,
            checks: membersCheck,
            q_check: membersQCheck,
            q_editors: membersQEdit,
            cleans: membersClean,
            edits: membersEdit,
            poster: membersPost,
        }).save();

        interaction.editReply({
            content: "Projet crée:",
            embeds: [projectConfigEmbed(project)],
        });

        return {
            status: "OK",
            label: "succès",
        };
    }
    interaction.editReply({
        content: "Erreur, veillez recommencer.",
    });
    return {
        status: "OK",
        label: "Uncompleted",
    };
}