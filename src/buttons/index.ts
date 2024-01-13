import { IButtonList } from "$types/buttons";

import * as closeTicket from "./close-ticket";

export { handleButtonPress } from "./handleButtonPress";
export const commands: IButtonList = {
    "close-ticket": closeTicket,
};
