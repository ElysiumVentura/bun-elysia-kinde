import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { SessionManager, Helpers } from "./src/helpers";
import { redis } from "./src/helpers";
import { PublicRoutes, EndpointRoutes } from "./src/routers";
import { AuthPlugin } from "./src/routers/pugins";
import config from "./config";

const sessionManager = new SessionManager(redis, Helpers.uuidGenerator);

const app = new Elysia()
    .use(cors())
    .use(cookie())
    .use(PublicRoutes(sessionManager)) // these routes do not require authentication
    .use(AuthPlugin(sessionManager)) // this sets the user object in the request context andy will throw an error if the user is not authenticated
    .use(EndpointRoutes(sessionManager)) // all routes below this line require authentication
    .listen(config.port);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export type Server = typeof app;
