import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { AuthPlugin } from "./pugins";
import { SessionManager } from "../helpers";

type User = {
    given_name: string;
    family_name: string;
    email: string;
    id: string;
};

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
        .get("/user", ({ user }) => {
            // user is set by the AuthPlugin
            return `Hello ${user.given_name} ${user.family_name}!`;
        })
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
            // we can also protect routes with middleware
            { beforeHandle: ({ user }) => checkPermissions(user, "read:session") },
        );

function checkPermissions(user: User, permission: string) {
    if (permission === "read:session") {
        throw new Error(`User ${user.given_name} does not have permission to read:session`);
    }
}

export default EndpointRoutes;
