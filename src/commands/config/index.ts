import { commandModule } from "$types/commands";

import * as newCmd from "./new";
import * as claim from "./claim";
import * as refresh from "./refresh";
import * as edit from "./edit";

export default {
    subCommand: true,
    name: "config",
    description: "Configuration du bot.",
    commands: {
        new: newCmd,
        claim,
        refresh,
        edit
    },
} as commandModule;
