import {
    APIApplicationCommand,
    APIApplicationCommandBasicOption,
} from "discord-api-types/v9";
import {
    APIApplicationCommandOption,
    ApplicationCommandSubCommand,
    Client,
    CommandInteraction,
} from "discord.js";

declare interface PartialApplicationCommand
    extends Partial<APIApplicationCommand> {
    name: string;
    description: string;
    options: APIApplicationCommandOption[];
}
declare interface PartialApplicationCommandSubCommand
    extends Partial<ApplicationCommandSubCommand> {
    name: string;
    description: string;
    options: APIApplicationCommandBasicOption[];
}

export type CommandReturn = {
    status: "OK" | "ERROR" | "IGNORE";
    /** le résultat de la commande, à afficher dans la console */
    label?: string;
};

interface rawCommandModule {
    subCommand?: false;
    data: PartialApplicationCommand;
    run: (
        client: Client,
        interaction: CommandInteraction,
    ) => Promise<CommandReturn>;
}

type commandModule =
    | rawCommandModule
    | {
          subCommand?: true;
          name: string;
          description: string;
          commands: {
              [key: string]: rawCommandModule & {
                  data: PartialApplicationCommandSubCommand;
              };
          };
      };

/**
 * list of commands and sub commands
 *
 * @example
 * let commands = {} as ICommandList;
 * let e = commands[""];
 * if (e?.subCommand === true) {
 *     e.commands[""].data;
 * } else if (e?.subCommand === false) {
 *     e.data;
 * }
 */
declare interface ICommandList {
    [key: string]: commandModule | undefined;
}
