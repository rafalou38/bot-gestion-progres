import mongoose from "mongoose";
import { log } from "$utils/log";

export async function connectDB(): Promise<void> {
    if (process.env.MONGO_URI) {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            mongoose.set("debug", true);
            log("✅ connecté a mongoDB 🌳");
        } catch (error) {
            log("❌ non connecté a mongoDB 🌳");
            console.error(error);
            process.exit(1);
        }
    } else {
        console.error("missing MONGO_URI in .env");
        process.exit(1);
    }
}
