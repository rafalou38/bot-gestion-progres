import chalk from "chalk";
import { commands } from "$commands/index";
import { context } from "$context/context";
import { Interaction, Message } from "discord.js";
import { CommandReturn, rawCommandModule } from "$types/commands";
import { log } from "$utils/log";
import { handleButtonPress } from "$buttons/index";
import * as Sentry from "@sentry/node";

export async function handleMessageCreate(message: Message): Promise<void> {
    return;
}
