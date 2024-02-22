import { Client, CommandInteraction, GuildMember } from "discord.js";
import {
    CommandReturn,
    PartialApplicationCommandSubCommand,
} from "$types/commands";
import { StaffMember } from "$db/schemas/member";

export const subCommand = false;
export const data: PartialApplicationCommandSubCommand = {
    name: "here",
    description: "Enregistre ton salon de membre.",
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
    const channelID = interaction.channelId;

    const staffMember = new StaffMember({
        memberID: authorID,
        channelID,
    });

    await staffMember.save();

    await interaction.reply("Ce salon t'est maintenant attribué <:652923835036860447:732262583176003655>");

    return {
        status: "OK",
        label: "SUCCESS",
    };
}
