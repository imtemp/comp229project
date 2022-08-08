import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";

import IUser from "./IUser";
import {
    pwdSaltRounds
} from "../shared/constants";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    pwdHash: {
        type: String,
        required: true
    },
});

// Configure the toJSON conversion
UserSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (_doc, ret) {
        delete ret.pwdHash;
        ret.id = ret._id;
    },
});

export function hashPwd(pwd: string): string {
    return bcrypt.hashSync(pwd, pwdSaltRounds);
}

const User = mongoose.model < IUser > ("User", UserSchema);
export default User;