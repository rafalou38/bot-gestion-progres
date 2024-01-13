import {
    ButtonInteraction,
    ButtonStyle,
    CommandInteraction,
    ComponentType,
    DMChannel,
    Message,
    SelectMenuInteraction,
    TextChannel,
} from "discord.js";
import { disableComponent, fakeReply } from "./index";

export async function askYesNo(
    DM: DMChannel | TextChannel,
    timeout: number,
    text: string,
    labelYes?: string,
    labelNo?: string,
    remove = false,
): Promise<boolean | null> {
    const sentMessage = await DM.send({
        content: text,
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Success,
                        label: labelYes || "OUI",
                        customId: "yes",
                    },
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Danger,
                        label: labelNo || "NON",
                        customId: "no",
                    },
                ],
            },
        ],
    });

    let buttonInteraction: ButtonInteraction;
    try {
        buttonInteraction = await sentMessage.awaitMessageComponent({
            time: timeout,
            componentType: ComponentType.Button,
        });
        if (remove) {
            sentMessage.delete();
        } else {
            await fakeReply(buttonInteraction);
        }
    } catch (error) {
        return null;
    }
    await disableComponent(sentMessage);
    return buttonInteraction.customId === "yes";
}
export async function askYesNoInteraction(
    interaction: ButtonInteraction | SelectMenuInteraction | CommandInteraction,
    timeout: number,
    text: string,
    remove = false,
    labelYes?: string,
    labelNo?: string,
): Promise<boolean | null> {
    const sentMessage = (await interaction.editReply({
        content: text,
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Success,
                        label: labelYes || "OUI",
                        customId: "yes",
                    },
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Danger,
                        label: labelNo || "NON",
                        customId: "no",
                    },
                ],
            },
        ],
    })) as Message;

    let buttonInteraction: ButtonInteraction;
    try {
        buttonInteraction = await sentMessage.awaitMessageComponent({
            time: timeout,
            componentType: ComponentType.Button,
        });
        if (remove) {
            await sentMessage.delete();
        }
    } catch (error) {
        return null;
    }
    await disableComponent(sentMessage);
    return buttonInteraction.customId === "yes";
}
