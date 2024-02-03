import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { AuthPlugin } from "./pugins";
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
        .get("/user", ({ user }) => {
            return `Hello ${user.given_name} ${user.family_name}!`;
        })
        .get("/session", ({ session }) => {
            // we can also access user through the session
            return {
                sessionId: session.sessionId,
                user: session.getSessionItem("user"),
            };
        });

export default EndpointRoutes;
