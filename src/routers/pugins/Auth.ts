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

const Auth = (sessionManager: SessionManager) =>
    new Elysia().use(cookie()).derive(async ({ cookie: { sessionId } }) => {
        const session = sessionManager.getSession(sessionId);
        const user = (await session?.getSessionItem("user")) ?? null;

        const result = UserSchema.safeParse(user);

        if (!user || !result.success) {
            throw new Error("Unauthorised");
        }

        return {
            user: result.data,
            session,
        };
    });

export default Auth;
