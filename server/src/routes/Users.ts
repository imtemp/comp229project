import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import { JwtService } from '../shared/JwtService';
import User, { hashPwd } from '../models/User';


const router = Router();
const jwtService = new JwtService();
const { NO_CONTENT, CONFLICT, BAD_REQUEST, CREATED, OK } = StatusCodes;


/// Create a new user - "POST /api/users/register"
router.post('/register', async (req: Request, res: Response) => {
    const userData: {
        username: string,
        password: string,
        email: string
    } = req.body;

    if (!userData.username || !userData.password || !userData.email) {
        return res
            .status(BAD_REQUEST)
            .json({
                error: "Missing one or more required parameters: email, username, password"
            });
    }

    if (await User.findOne({ username: userData.username })) {
        return res.status(CONFLICT).json({
            "error": `Username ${userData.username} is already taken`
        })
    };
    if (await User.findOne({ email: userData.email })) {
        return res.status(CONFLICT).json({
            "error": `Email ${userData.email} is already linked to an account`
        })
    };

    const user = new User(userData);
    user.pwdHash = hashPwd(userData.password);
    await user.save();

    await jwtService.signResponse(res, { id: user._id });
    return res.status(CREATED).json(user.toJSON()).end();
});


/// Update the user information -  "PUT /api/users/update"
router.put('/update', async (req: Request, res: Response) => {
    const userData = req.body;

    if (!userData.id) {
        return res.status(BAD_REQUEST).json({
            error: `Missing the user ID parameter.`,
        });
    }
    // Make sure that the password hash is not sneakily changed
    delete userData.pwdHash;

    await User.findByIdAndUpdate(userData.id, userData);
    return res.status(OK).end();
});


/// Delete an existing user - "DELETE /api/users/delete/:id"
router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const hadUser = await User.findByIdAndDelete(id) != null;
    return res.status(hadUser ? OK : NO_CONTENT).end();
});

export default router;
