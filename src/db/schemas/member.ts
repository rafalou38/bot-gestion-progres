import { Document, model, Schema, Types } from "mongoose";

export interface IStaffMember {
    memberID: string;
    channelID: string;
}
export type DBStaffMember = Document<unknown, unknown, IStaffMember> &
    IStaffMember & {
        _id: Types.ObjectId;
    };

const schema = new Schema<IStaffMember>({
    memberID: String,
    channelID: String,
});

export const StaffMember = model<IStaffMember>("staff-member", schema);
