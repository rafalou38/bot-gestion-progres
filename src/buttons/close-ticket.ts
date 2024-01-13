import { ButtonInteraction, Client, Colors, TextChannel } from "discord.js";

import { CommandReturn } from "$types/commands";
import { sleep } from "$utils";

export const subCommand = false;

export async function run(
    client: Client,
    interaction: ButtonInteraction,
): Promise<CommandReturn> {
    if (!(interaction.channel instanceof TextChannel))
        return { status: "IGNORE" };

    if (
        !interaction.channel.name.startsWith("ticket-de") &&
        !interaction.channel.name.startsWith("mission-de")
    ) {
        await interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description: "Vous ne vous trouvez pas dans un ticket.",
                    color: Colors.Red,
                },
            ],
            ephemeral: true,
        });
        return { status: "ERROR", label: "OUTSIDE_TICKET" };
    }
    interaction.channel?.send("Le ticket sera supprimé dans 5 secondes.");
    await sleep(1000 * 5);

    await interaction.channel.delete();

    return {
        status: "OK",
        label: "TICKET_DELETED",
    };
}
