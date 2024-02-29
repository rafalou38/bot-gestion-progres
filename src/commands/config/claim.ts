import { ApplicationCommandOptionType, Client, CommandInteraction, GuildMember } from "discord.js";
import {
    CommandReturn,
    PartialApplicationCommandSubCommand,
} from "$types/commands";
import { StaffMember } from "$db/schemas/member";

export const subCommand = false;
export const data: PartialApplicationCommandSubCommand = {
    name: "claim",
    description: "Enregistre un salon de membre.",
    options: [
        {
            name: "membre",
            description: "Membre a attribuer.",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "salon",
            description: "Salon a attribuer.",
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],
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

    const authorID = interaction.options.getUser("membre", true).id;
    const channelID = interaction.options.get("salon", true).value as string;

    const staffMember = new StaffMember({
        memberID: authorID,
        channelID,
    });

    await staffMember.save();

    await interaction.reply("<@" + authorID + "> <==> <#" + channelID + ">");

    return {
        status: "OK",
        label: "SUCCESS",
    };
}
