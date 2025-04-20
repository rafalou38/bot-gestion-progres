import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember, Message, TextChannel } from "discord.js";
import {
    CommandReturn,
    PartialApplicationCommandSubCommand,
} from "$types/commands";
import { DBProject, IProject, Project } from "$db/schemas/project";
import { projectConfigEmbed } from "$utils/embeds/project";

export const subCommand = false;
export const data: PartialApplicationCommandSubCommand = {
    name: "edit",
    description: "Modifie la configuration d'un projet.",
    options: [
        { type: ApplicationCommandOptionType.String, name: "nom", description: "Nom du projet", required: false },
        // { type: ApplicationCommandOptionType.Channel, name: "salon", description: "Salon du projet", required: false },
        { type: ApplicationCommandOptionType.String, name: "va", description: "Lien de la VA", required: false },
        { type: ApplicationCommandOptionType.String, name: "pcloud", description: "Lien du Pcloud", required: false },
        { type: ApplicationCommandOptionType.String, name: "traducteurs", description: "Mention(s) traducteurs", required: false },
        { type: ApplicationCommandOptionType.String, name: "checkeurs", description: "Mention(s) checkeurs", required: false },
        { type: ApplicationCommandOptionType.String, name: "q_checkeurs", description: "Mention(s) q_checkeurs", required: false },
        { type: ApplicationCommandOptionType.String, name: "cleaners", description: "Mention(s) cleaners", required: false },
        { type: ApplicationCommandOptionType.String, name: "editeurs", description: "Mention(s) editeurs", required: false },
        { type: ApplicationCommandOptionType.String, name: "posteurs", description: "Mention(s) posteurs", required: false },

    ],
};

export async function run(
    client: Client,
    interaction: CommandInteraction,
): Promise<CommandReturn> {
    if (!interaction.isCommand() || !(interaction.member instanceof GuildMember) || !(interaction.channel instanceof TextChannel)) {
        return { status: "IGNORE" };
    }

    const project = await Project.findOne({ channel: interaction.channel.id }) as DBProject;

    if (!project) {
        await interaction.reply({ content: "Projet non trouvé.", ephemeral: true });
        return { status: "OK", label: "Project Not Found" };
    }

    const newName = interaction.options.get("nom", false)?.value as string || null;
    const newVa = interaction.options.get("va", false)?.value as string || null;
    const newPcloud = interaction.options.get("pcloud", false)?.value as string || null;
    const newTraductors = interaction.options.get("traducteurs", false)?.value as string || null;
    const newCheckers = interaction.options.get("checkeurs", false)?.value as string || null;
    const newQCheckers = interaction.options.get("q_checkeurs", false)?.value as string || null;
    const newCleaners = interaction.options.get("cleaners", false)?.value as string || null;
    const newEditors = interaction.options.get("editeurs", false)?.value as string || null;
    const newPosters = interaction.options.get("posteurs", false)?.value as string || null;

    if (newName) project.name = newName;
    if (newVa) project.vaLink = newVa;
    if (newPcloud) project.pcloudLink = newPcloud;


    if (newTraductors && newTraductors.match(/\d+/g) != null) project.trads = newTraductors.match(/\d+/g) || [];
    if (newCheckers && newCheckers.match(/\d+/g) != null) project.checks = newCheckers.match(/\d+/g) || [];
    if (newQCheckers && newQCheckers.match(/\d+/g) != null) project.q_checks = newQCheckers.match(/\d+/g) || [];
    if (newCleaners && newCleaners.match(/\d+/g) != null) project.cleans = newCleaners.match(/\d+/g) || [];
    if (newEditors && newEditors.match(/\d+/g) != null) project.edits = newEditors.match(/\d+/g) || [];
    if (newPosters && newPosters.match(/\d+/g) != null) project.poster = newPosters.match(/\d+/g) || [];


    await project.save();

    interaction.reply({ content: "Configuration mise à jour.\n Pour mettre a jour l'embed:\n```\n/config refresh message_id:\n```", embeds: [projectConfigEmbed(project)], ephemeral: true });

    return {
        status: "OK",
        label: "Uncompleted",
    };
}