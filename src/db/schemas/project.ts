import { Document, model, Schema, Types } from "mongoose";

export interface IProject {
    name: string,
    channel: string,
    trads: string[],
    checks: string[],
    cleans: string[],
    edits: string[],
    poster: string[]
}
export type DBProject = Document<unknown, unknown, IProject> &
    IProject & {
        _id: Types.ObjectId;
    };

const schema = new Schema<IProject>({
    name: String,
    // channelSubmit: String,
    channel: String,
    trads: [{ type: String }],
    checks: [{ type: String }],
    cleans: [{ type: String }],
    edits: [{ type: String }],
    poster: [{ type: String }],
});

export const Project = model<IProject>("project", schema);
