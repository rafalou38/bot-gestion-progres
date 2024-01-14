import dotenv from "dotenv";
dotenv.config(); // load discord token from .env

import * as Sentry from "@sentry/node";

import Discord from "discord.js";

import { log } from "$utils/log";
import { handleInteractionCreate } from "$events/interactionCreate";
import { connectDB } from "$db/init";
import { context } from "$context/context";
import { handleMessageCreate } from "$events/messageCreate";

if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
    });
} else {
    log("Sentry is not configured.");
}

const client = new Discord.Client({
    intents: ["Guilds", "GuildMessages", "MessageContent"],
});
context.client = client;

client.once("ready", async () => {
    log(`🤖 Bot ${client.user?.tag} successfully started 🚀`);
});

client.on("interactionCreate", handleInteractionCreate);
client.on("messageCreate", handleMessageCreate);

connectDB().then(() => {
    client.login(process.env.BOT_TOKEN);
});
