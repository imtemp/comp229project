import { Request } from 'express';
import { IUser } from '../models/IUser';

export const ENV = process.env.NODE_ENV || 'development';

// Strings
export const missingParamError = 'One or more of the required parameters were missing.';
export const emailNotFoundErr = 'Email doesn\'t exist';
export const wrongPasswordErr = "Wrong password";

// Numbers
export const pwdSaltRounds = 12;

// Cookie Properties
export const cookieProps = Object.freeze({
    key: 'team5cookie',
    secret: process.env.COOKIE_SECRET,
    options: {
        /* 
            XXX: this apparently makes our cookies unaccessible on the client
            See: https://owasp.org/www-community/HttpOnly
        */
        // httpOnly: true, 
        signed: true,
        path: (process.env.COOKIE_PATH),
        maxAge: Number(process.env.COOKIE_EXP),
        domain: (process.env.COOKIE_DOMAIN),
        secure: (process.env.SECURE_COOKIE === 'true'),
        overwrite: true,
    },
});

export const ORIGIN_WHITELIST = Object.freeze(
    ENV === 'production'
        ? ["https://five.whatever.team"]
        : ['http://localhost:3000', 'http://localhost:4200']
);

// CORS configuration
export const CORS = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => any) => {
        if (!origin || ORIGIN_WHITELIST.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
};

const _MONGO_USER = process.env.MONGO_USERNAME;
const _MONGO_PASS = process.env.MONGO_PASSWORD;
const _MONGO_DB = process.env.MONGO_DATABASE || 'project_db';

export const DB_URI = _MONGO_USER
    ? `mongodb+srv://${_MONGO_USER}:${_MONGO_PASS}@cluster0.zj2g4.mongodb.net/${_MONGO_DB}?retryWrites=true&w=majority`
    : `mongodb://localhost/${_MONGO_DB}`;

console.log(DB_URI);