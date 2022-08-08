import { Request, Response, RequestHandler, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { cookieProps } from './constants';
import { JwtService } from './JwtService';

const { UNAUTHORIZED } = StatusCodes;

const jwtService = new JwtService();

/// Attempts to decode the possibly present JWT and assign the payload to Request.userId.
/// Request.userId will be either a string or undefined.
export async function extractUserIdFromJWT(req: Request<any>, res: Response<any>, next: NextFunction) {
    let token = req.signedCookies[cookieProps.key];

    if (token && token.startsWith("s%3A")) {
        token = token.slice(4);
    }

    try {
        const { id } = await jwtService.decodeJwt(token);
        req.userId = id;
    } catch (e) {
        // do nothing
    } finally {
        next();
    }
}

/// Ensures that the given request is authorized by inspecting the session
/// cookie. Rejects the request with HTTP 403 UNAUTHORIZED if the JWT
/// is missing, invalid, or has expired.
export async function
    ensureRequestAuth(req: Request<any>, res: Response<any>, next: NextFunction) {
    let token: string = req.signedCookies[cookieProps.key];
    
    if (!token) {
        return res.status(UNAUTHORIZED).json({ error: "JWT is missing" });
    } else if (token.startsWith("s%3A")) {
        token = token.slice(4);
    }


    try {
        const { id } = await jwtService.decodeJwt(token);
        req.userId = id;
        next();
    } catch (e) {
        res.status(UNAUTHORIZED).json({ error: "Invalid or expired JWT." });
    }
}
