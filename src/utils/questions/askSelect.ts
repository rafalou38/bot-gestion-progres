import {
    CommandInteraction,
    ComponentType,
    DMChannel,
    Message,
    MessageCreateOptions,
    SelectMenuComponentOptionData,
    StringSelectMenuInteraction,
    TextChannel,
} from "discord.js";
import { disableComponent } from "./index";

export async function askSelectOne<T>(
    channel: DMChannel | TextChannel,
    timeout: number,
    text: string,
    options: (SelectMenuComponentOptionData & { value: T })[],
    interaction?: CommandInteraction,
) {
    const msgOptions: MessageCreateOptions = {
        content: text,
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.StringSelect,
                        customId: "dev-select",
                        options,
                    },
                ],
            },
        ],
    };
    let sentMessage: Message;
    if (interaction)
        sentMessage = (await interaction.editReply(msgOptions)) as Message;
    else sentMessage = await channel.send(msgOptions);

    let selectInteraction: StringSelectMenuInteraction;
    try {
        selectInteraction = await sentMessage.awaitMessageComponent({
            time: timeout,
            componentType: ComponentType.StringSelect,
        });
        // await fakeReply(selectInteraction);
    } catch (error) {
        return {
            interaction: null,
            value: null,
        };
    }

    if (!interaction) await disableComponent(sentMessage);
    return {
        interaction: selectInteraction,
        value: selectInteraction.values[0] as unknown as T,
    };
}
