import { User } from "../routers/pugins";

export default class Endpoints {
    public static getUser(user: User) {
        return `${user.firstName} ${user.lastName}`;
    }
}
