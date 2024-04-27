import { Project } from "$db/schemas/project";
import { CommandReturn, PartialApplicationCommandSubCommand } from "$types/commands";
import { projectConfigEmbed } from "$utils/embeds/project";
import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember, TextChannel } from "discord.js";

export const data: PartialApplicationCommandSubCommand = {
    name: "refresh",
    description: "Mettre à jour l'embed du projet.",
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "message_id",
            description: "L'identifiant du message de l'embed à mettre à jour",
            required: true,
        }
    ],
};

export async function run(
    client: Client,
    interaction: CommandInteraction,
): Promise<CommandReturn>
{
    if (!interaction.isCommand() || !(interaction.member instanceof GuildMember) || !(interaction.channel instanceof TextChannel)) {
        return { status: "IGNORE" };
    }

    // const projectId = interaction.options.getString("project_id", true);
    const project = await Project.findOne({channel: interaction.channel.id});

    if (!project) {
        await interaction.reply({ content: "Projet non trouvé.", ephemeral: true });
        return { status: "OK", label: "Project Not Found" };
    }

    // Id du message a recup dans la sauvegarde Projet de mangoDB 
    const messageId = interaction.options.get("message_id", true)?.value as string;
    if (!messageId) {
        await interaction.reply({ content: "Message d'embed non trouvé pour ce projet.", ephemeral: true });
        return { status: "OK", label: "Embed Message Not Found" };
    }

    const updatedEmbed = projectConfigEmbed(project);
    try {
        const channel = await client.channels.fetch(project.channel) as TextChannel;
        const message = await channel.messages.fetch(messageId);
        await message.edit({ embeds: [updatedEmbed] });
        await interaction.reply({ content: "Embed mis à jour avec succès.", ephemeral: true });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "Erreur lors de la mise à jour de l'embed.", ephemeral: true });
    }

    return { status: "OK", label: "Updated" };
}