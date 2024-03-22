import { Model, model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email?: string;
    createdAt: Date
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});


export const User: Model<IUser> = model('Users', userSchema);

export interface IAccount extends Document {
    accountId: string
    balance: number;
    active: Boolean,
    updatedAt: Date;
}

const  accountSchema = new Schema<IAccount>({
    accountId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now },
});

export const Account = model<IAccount>('Accounts', accountSchema);
