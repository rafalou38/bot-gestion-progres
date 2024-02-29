import { Document, model, Schema, Types } from "mongoose";

export interface IChapter {
    number: number;
    project: Types.ObjectId;
    translated: boolean;
    notifications: string[]; // task-channelID-messageID
    checked: boolean;
    cleaned: boolean;
    edited: boolean;
    posted: boolean;
    messageID: string;
    acknowledged: string[];
}
export type DBChapter = Document<unknown, unknown, IChapter> &
    IChapter & {
        _id: Types.ObjectId;
    };

const schema = new Schema<IChapter>({
    number: Number,
    project: { type: Schema.Types.ObjectId, ref: "project" },
    notifications: [String],
    translated: Boolean,
    checked: Boolean,
    cleaned: Boolean,
    edited: Boolean,
    posted: Boolean,
    messageID: String,
    acknowledged: [String],
});

export const Chapter = model<IChapter>("chapter", schema);
