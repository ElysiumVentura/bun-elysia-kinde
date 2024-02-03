import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { AuthPlugin, User } from "./pugins";
import { SessionManager } from "../helpers";

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
            ({ user }) => {
                // user is set by the AuthPlugin
                return `Hello ${user.firstName} ${user.lastName}!`;
            },
            // we can also protect routes with middleware
            { beforeHandle: ({ user }) => checkPermissions(user, "read:user") },
        )
        .get("/session", ({ session }) => {
            // we can also access user through the session
            return {
                sessionId: session.sessionId,
                user: session.getSessionItem("user"),
            };
        })
        .get(
            "/session-protected",
            ({ session }) => {
                return {
                    sessionId: session.sessionId,
                    user: session.getSessionItem("user"),
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
