import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { AuthPlugin, PermissionsPlugin } from "./pugins";
import { EndpointHandler } from "../handlers";

const EndpointRoutes = new Elysia()
    .use(cookie())
    .use(AuthPlugin)
    .use(PermissionsPlugin)
    .get("/hello", () => {
        return "World!";
    })
    .get(
        "/user",
        // we can now access the user object from the context
        ({ user }) => EndpointHandler.getUser(user),
        { permission: "read:user" },
    )
    .get(
        "/session",
        async ({ session }) => {
            // we can also access user through the session
            return {
                sessionId: session.sessionId,
                user: await session.getSessionItem("user"),
            };
        },
        { permission: "read:session" },
    );

export default EndpointRoutes;
