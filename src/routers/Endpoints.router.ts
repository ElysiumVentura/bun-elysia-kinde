import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { AuthPlugin, User } from "./pugins";
import { SessionManager } from "../helpers";
import { EndpointHandler } from "../handlers";

const EndpointRoutes = (sessionManager: SessionManager) =>
    new Elysia()
        .use(cookie())
        .use(AuthPlugin(sessionManager))
        .get("/hello", () => {
            return "Hello!";
        })
        .get("/world", () => {
            return "World!";
        })
        .get(
            "/user",
            // we can access the user object from the request context
            ({ user }) => EndpointHandler.getUser(user),
            // we can also protect routes with middleware
            { beforeHandle: ({ user }) => checkPermissions(user, "read:user") },
        )
        .get("/session", async ({ session }) => {
            // we can also access user through the session
            return {
                sessionId: session.sessionId,
                user: await session.getSessionItem("user"),
            };
        })
        .get(
            "/session-protected",
            async ({ session }) => {
                return {
                    sessionId: session.sessionId,
                    user: await session.getSessionItem("user"),
                };
            },
            // this route will fail permission checking
            { beforeHandle: ({ user }) => checkPermissions(user, "read:session") },
        );

function checkPermissions(user: User, permission: string) {
    if (!user.permissions.includes(permission)) {
        throw new Error(`User ${user.firstName} does not have permission to read:session`);
    }
}

export default EndpointRoutes;
