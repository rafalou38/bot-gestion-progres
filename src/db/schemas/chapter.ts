import { Document, model, Schema, Types } from "mongoose";

export interface IChapter {
    number: number;
    project: Types.ObjectId;
    translated: boolean;
    checked: boolean;
    cleaned: boolean;
    edited: boolean;
    posted: boolean;
}
export type DBChapter = Document<unknown, unknown, IChapter> &
    IChapter & {
        _id: Types.ObjectId;
    };

const schema = new Schema<IChapter>({
    number: Number,
    project: { type: Schema.Types.ObjectId, ref: "project" },
    translated: Boolean,
    checked: Boolean,
    cleaned: Boolean,
    edited: Boolean,
    posted: Boolean,
});

export const Chapter = model<IChapter>("chapter", schema);
