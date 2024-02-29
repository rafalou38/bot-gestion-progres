import { commandModule } from "$types/commands";

import * as newCmd from "./new";
import * as claim from "./claim";

export default {
    subCommand: true,
    name: "config",
    description: "Configuration du bot.",
    commands: {
        new: newCmd,
        claim,
    },
} as commandModule;
