import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    id: string;
    username: string;
    email: string;
    pwdHash: string;
}

export default IUser;
