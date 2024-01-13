import { Client } from "discord.js";

interface IContext {
    client: Client;
}
export const context: IContext = {
    client: {} as Client,
};
