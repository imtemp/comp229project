export class User {
    /// The id of the user.
    id: string | null;
    /// The username of the user.
    username: string;
    /// The email of the user.
    email: string;

    constructor(id: string | null, username: string, email: string) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}
