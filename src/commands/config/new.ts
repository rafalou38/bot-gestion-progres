import {
    Client,
    Colors,
    CommandInteraction,
    GuildMember,
    Message,
    TextChannel,
} from "discord.js";
import { config } from "$context/config";
import {
    CommandReturn,
    PartialApplicationCommandSubCommand,
} from "$types/commands";
import { askText } from "$utils/questions";
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
        const channelSubmit = (
            await askTextInteraction(
                interaction,
                1000 * 60 * 5,
                "Quel est le channel de soumission ?",
                true,
                (m) => authorCheck(m) && !!includesChannelCheck(m),
            )
        )?.mentions.channels.first();
        if (!channelSubmit) break collect;

        const channelTask = (
            await askTextInteraction(
                interaction,
                1000 * 60 * 5,
                "Quel est le channel des tâches ?",
                true,
                (m) => authorCheck(m) && !!includesChannelCheck(m),
            )
        )?.mentions.channels.first();
        if (!channelTask) break collect;

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
            channelSubmit: channelSubmit.id,
            channelTask: channelTask.id,
            membersTrad: membersTrad,
            membersCheck: membersCheck,
            membersClean: membersClean,
            membersEdit: membersEdit,
            membersPost: membersPost,
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