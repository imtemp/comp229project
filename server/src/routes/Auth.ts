import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import StatusCodes from 'http-status-codes';

import { JwtService } from '../shared/JwtService';
import { missingParamError, cookieProps, emailNotFoundErr, wrongPasswordErr } from '../shared/constants';
import User from "../models/User";


const router = Router();
const jwtService = new JwtService();
const { BAD_REQUEST, OK, UNAUTHORIZED } = StatusCodes;



/******************************************************************************
 *                      Login User - "POST /api/auth/login"
 ******************************************************************************/

router.post('/login', async (req: Request, res: Response) => {
    // Make sure that the email and password are present
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(BAD_REQUEST).json({
            error: missingParamError,
        });
    }

    // Find the user by email
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
        return res.status(UNAUTHORIZED).json({
            error: emailNotFoundErr,
        });
    }

    // Check password
    const pwdPassed = await bcrypt.compare(password, user.pwdHash);
    if (!pwdPassed) {
        return res.status(UNAUTHORIZED).json({
            error: wrongPasswordErr,
        });
    }
    await jwtService.signResponse(res, { id: user._id });
    return res.status(OK).json(user.toJSON());
});



/******************************************************************************
 *                      Logout - "GET /api/auth/logout"
 ******************************************************************************/

router.get('/logout', (_: Request, res: Response) => {
    const { key, options } = cookieProps;
    const clearOptions: any = { ...options };
    delete clearOptions.maxAge;
    res.clearCookie(key, clearOptions);
    return res.status(OK).end();
});


export default router;
