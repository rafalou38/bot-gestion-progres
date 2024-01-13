import chalk from "chalk";
import { commands } from "$commands/index";
import { context } from "$context/context";
import { Interaction } from "discord.js";
import { CommandReturn, rawCommandModule } from "$types/commands";
import { log } from "$utils/log";
import { handleButtonPress } from "$buttons/index";
import * as Sentry from "@sentry/node";

export async function handleInteractionCreate(
    interaction: Interaction,
): Promise<void> {
    if (interaction.isChatInputCommand()) {
        let command: rawCommandModule | undefined;

        let subCommandName;
        try {
            subCommandName = interaction.options.getSubcommand();
        } catch {}

        if (subCommandName) {
            const group = commands[interaction.commandName];
            if (group?.subCommand === true) {
                command = group.commands[subCommandName];
            }
        } else {
            command = commands[interaction.commandName] as rawCommandModule;
        }
        if (!command)
            return log(
                chalk.green(`/${interaction.commandName}`),
                "exécuté par",
                chalk.blue(interaction.user.tag),
                "❌",
                chalk.bold(chalk.red("NO_EXIST")),
            );
        let result: CommandReturn = { status: "ERROR", label: "Unknown error" };
        let error: unknown;
        try {
            result = await command.run(context.client, interaction);
        } catch (err) {
            error = err;
            Sentry.captureException(err);
        }

        log(
            chalk.green(`/${interaction.commandName}`),
            "exécuté par",
            chalk.blue(interaction.user.tag),
            result.status === "OK" && !error ? "✔️" : "❌",
            result.label || "",
            error || result.status !== "OK"
                ? error || chalk.bold(chalk.red(result))
                : "",
        );
    } else if (interaction.isButton()) {
        handleButtonPress(interaction);
    }
}
