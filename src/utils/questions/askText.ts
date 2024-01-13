import {
    ButtonInteraction,
    CollectorFilter,
    CommandInteraction,
    DMChannel,
    Message,
    SelectMenuInteraction,
} from "discord.js";

export async function askText(
    DM: DMChannel,
    timeout: number,
    text: string,
): Promise<string | null> {
    await DM.send({
        content: text,
    });

    let value: string;
    try {
        const received = await DM.awaitMessages({
            time: timeout,
            max: 1,
        });
        value = received.first()?.content || "";
    } catch (error) {
        return null;
    }

    return value;
}
/**
 * A function that asks for user input through an interaction and returns the
 * user's response as a string. The function displays a given text to the user
 * and waits for a response within a specified timeout period. If no response
 * is received, or an error occurs, the function returns null.
 *
 * @param {ButtonInteraction | SelectMenuInteraction | CommandInteraction} interaction - The interaction object representing the user's input.
 * @param {number} timeout - The timeout period in milliseconds for waiting for user input.
 * @param {string} text - The text to be displayed to the user.
 * @param {boolean} [remove=false] - Indicates whether the received message should be removed after processing.
 * @param {CollectorFilter<[Message]>} [filter] - An optional filter to apply when waiting for user input.
 * @return {Promise<string | null>} The user's response as a string, or null if no response is received or an error occurs.
 */
export async function askTextInteraction(
    interaction: ButtonInteraction | SelectMenuInteraction | CommandInteraction,
    timeout: number,
    text: string,
    remove = false,
    filter?: CollectorFilter<[Message]>,
): Promise<Message | null> {
    await interaction.editReply({
        content: text,
    });

    let result: Message | null;
    try {
        const received = await interaction.channel?.awaitMessages({
            time: timeout,
            max: 1,
            filter,
        });
        result = received?.first() || null;
        if (remove) await received?.first()?.delete();
    } catch (error) {
        return null;
    }

    return result;
}
