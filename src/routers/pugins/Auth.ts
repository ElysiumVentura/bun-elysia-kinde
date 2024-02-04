import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { z } from "zod";
import { SessionManager } from "../../helpers";

const UserSchema = z.object({
    family_name: z.string(),
    given_name: z.string(),
    email: z.string(),
    id: z.string(),
});

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    permissions: string[];
};

const Auth = new Elysia().use(cookie()).derive(async ({ cookie: { sessionId } }) => {
    const session = await SessionManager.getSession(sessionId);
    const user = (await session.getSessionItem("user")) ?? null;

    const result = UserSchema.safeParse(user);

    if (!user || !result.success) {
        throw new Error("Unauthorised");
    }

    // this is where we would call db to get the user's permissions
    const permissions = ["read:user", "write:user"];

    if (!permissions) {
        throw new Error("unable to load permissions");
    }

    return {
        user: {
            id: result.data.id,
            firstName: result.data.given_name,
            lastName: result.data.family_name,
            email: result.data.email,
            permissions,
        },
        permissions,
        session,
    };
});

export default Auth;
