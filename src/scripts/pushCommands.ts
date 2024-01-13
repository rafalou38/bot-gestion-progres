import readline from "readline";
import dotenv from "dotenv";
import util from "util";
import axios from "axios";
import { commands } from "$commands/index";
import { APIApplicationCommand } from "discord-api-types/v9";
import { PartialApplicationCommand, ICommandList } from "$types/commands";

import * as Diff from "diff";
import chalk from "chalk";
import {
    APIApplicationCommandBasicOption,
    APIApplicationCommandOption,
} from "discord.js";

dotenv.config();

const headers = {
    Authorization: `Bot ${process.env.BOT_TOKEN}`,
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function formatAPICommands(
    commands: APIApplicationCommand[],
): PartialApplicationCommand[] {
    const commandsClone = JSON.parse(
        JSON.stringify(commands),
    ) as PartialApplicationCommand[];

    for (const command of commandsClone) {
        delete command.id;
        delete command.version;
        delete command.description_localizations;
        delete command.name_localizations;
        delete command.application_id;
        delete command.default_member_permissions;
        delete command.default_permission;
        delete command.guild_id;
        if (!command.options) command.options = [];

        for (const option of command.options) {
            delete option.description_localizations;
            delete option.name_localizations;
        }
    }

    return commandsClone.sort((a, b) =>
        a.name.localeCompare(b.name),
    ) as PartialApplicationCommand[];
}

function formatOURCommands(commands: ICommandList) {
    if (!process.env.APP_ID) throw new Error("Missing APP_ID");
    if (!process.env.GUILD_ID) throw new Error("Missing GUILD_ID");

    const result: PartialApplicationCommand[] = [];

    for (const [, command] of Object.entries(commands)) {
        if (command?.subCommand) {
            const resultCommand: typeof result[0] = {
                name: command.name,
                description: command.description,
                options: [],
                type: 1,
                // default_member_permissions: null,
                // default_permission: true,
                // application_id: process.env.APP_ID,
                // guild_id: process.env.GUILD_ID,
            };

            for (const subCommand of Object.values(command.commands)) {
                const data = subCommand.data;
                if (data)
                    resultCommand.options.push({
                        name: data.name,
                        description: data.description,
                        options: data.options.map(
                            (opt: APIApplicationCommandBasicOption) => {
                                if (!opt.required) delete opt.required;
                                return opt;
                            },
                        ),
                        type: 1,
                    });
            }
            result.push(resultCommand);
        } else if (command?.subCommand == false) {
            const data = command.data;
            result.push({
                name: data.name,
                description: data.description,
                options: data.options.map(
                    (opt: APIApplicationCommandOption) => {
                        if (!opt.required) delete opt.required;
                        return opt;
                    },
                ),
                type: 1,
                // default_member_permissions:
                //     data.default_member_permissions || null,
                // default_permission: true,
                // application_id: process.env.APP_ID,
                // guild_id: process.env.GUILD_ID,
            });
        }
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
}

async function deploy() {
    const ourCommands = formatOURCommands(commands);

    process.stdout.write(">> Checking current commands ");
    const currentCommandsResponse = await axios({
        method: "GET",
        url: `https://discord.com/api/v9/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`,
        headers,
    });
    let currentCommands: PartialApplicationCommand[];

    if (currentCommandsResponse.status === 200) {
        currentCommands = formatAPICommands(currentCommandsResponse.data);
        process.stdout.write("Ok.\n");
    } else {
        process.stdout.write("Error. \n");
        throw new Error("Failed to fetch");
    }

    console.log(">> DIFF:");

    const diff = Diff.diffJson(currentCommands, ourCommands);
    let change = false;
    let added = 0;
    let removed = 0;
    diff.forEach((part) => {
        // green for additions, red for deletions
        // grey for common parts
        let colorModifier = chalk.gray;
        if (part.added) {
            added++;
            colorModifier = chalk.green;
            change = true;
        } else if (part.removed) {
            removed++;
            colorModifier = chalk.red;
            change = true;
        }
        process.stderr.write(colorModifier(part.value));
    });

    if (!change) {
        console.log("\n\nNo changes where made.");
        process.exit();
    } else {
        console.log(
            `\n\nchanges: ${chalk.red("-" + removed)} ${chalk.green(
                "+" + added,
            )}`,
        );
    }

    const result: string = await new Promise((resolve) =>
        rl.question("\nIs it ok? (y|n)\n> ", resolve),
    );
    const ok = result === "y" ? 1 : 0;
    if (!ok) {
        console.log("aborting...");
        process.exit();
    }

    const r = await axios({
        method: "PUT",
        url: `https://discord.com/api/v9/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`,
        headers,
        data: ourCommands,
        validateStatus: () => true,
    });

    if (r.status === 200) {
        process.stdout.write("Successfully pushed.");
    } else {
        process.stdout.write("❌ ");
        console.log(r.statusText);
        console.log(
            util.inspect(r.data, {
                showHidden: false,
                depth: null,
                colors: true,
            }),
        );
    }
    process.stdout.write("\n");
    process.exit();
}

deploy();
