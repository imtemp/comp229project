import { Response } from 'express';
import randomString from 'randomstring';
import jsonwebtoken, { VerifyErrors } from 'jsonwebtoken';
import { cookieProps } from '../shared/constants';


interface IClientData {
    id: string;
}

interface IOptions {
    expiresIn: string;
}

export class JwtService {
    private readonly secret: string;
    private readonly options: IOptions;
    private readonly VALIDATION_ERROR = 'JSON-web-token validation failed.';

    constructor() {
        this.secret = (cookieProps.secret || randomString.generate(100));
        this.options = { expiresIn: cookieProps.options.maxAge.toString() };
    }

    /// Encrypts the data and returns a jwt.
    public getJwt(data: IClientData): Promise<string> {
        return new Promise((resolve, reject) => {
            jsonwebtoken.sign(data, this.secret, this.options, (err, token) => {
                err ? reject(err) : resolve(token);
            });
        });
    }

    /// Decrypts a JWT and extracts the client data.
    public decodeJwt(jwt: string): Promise<IClientData> {
        return new Promise((res, rej) => {
            jsonwebtoken.verify(jwt, this.secret, (err: VerifyErrors | null, decoded?: object) => {
                return err ? rej(this.VALIDATION_ERROR) : res(decoded as IClientData);
            });
        });
    }

    /// Signs the given data and sets the JWT cookie on the given response.
    public async signResponse<T>(response: Response<T>, data: IClientData): Promise<Response<T>> {
        const jwt = await this.getJwt(data);
        const { key, options } = cookieProps;
        response.cookie(key, jwt, options);
        return response;
    }
}
