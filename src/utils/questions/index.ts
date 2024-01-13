import {
    ButtonInteraction,
    CommandInteraction,
    Message,
    SelectMenuInteraction,
    ActionRowBuilder,
    ButtonBuilder,
} from "discord.js";

export { askSelectOne } from "./askSelect";
export { askText } from "./askText";
export { askYesNo } from "./askYesNo";

export async function disableComponent(message: Message) {
    const newComponents = message.components.map((row) => {
        const rowBuild = ActionRowBuilder.from(row);
        rowBuild.components.forEach((c) =>
            (c as ButtonBuilder).setDisabled(true),
        );

        return rowBuild;
    });

    // Todo check if it works

    message.edit({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        components: newComponents as any,
    });
}

export async function fakeReply(
    interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction,
) {
    await interaction.reply("** **");
    // await interaction.deleteReply();
}
