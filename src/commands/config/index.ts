import { commandModule } from "$types/commands";

import * as newCmd from "./new";

export default {
    subCommand: true,
    name: "config",
    description: "Configuration du bot.",
    commands: {
        new: newCmd,
    },
} as commandModule;
