import { commandModule } from "$types/commands";

import * as newCmd from "./new";
import * as here from "./here";

export default {
    subCommand: true,
    name: "config",
    description: "Configuration du bot.",
    commands: {
        new: newCmd,
        here,
    },
} as commandModule;
