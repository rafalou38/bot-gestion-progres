import { ICommandList } from "types/commands";

import config from "./config";
import * as newChap from "./newChapter";

export const commands: ICommandList = {
    "nouveau-chapitre": newChap,
    config,
};
