import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { swagger } from "@elysiajs/swagger";
import { PublicRoutes, EndpointRoutes } from "./src/routers";
import { AuthPlugin } from "./src/routers/pugins";
import config from "./config";

// we can use `decorate` to add functions to the context - e.g. db query, sentry, etc

const app = new Elysia()
    .use(swagger())
    .use(cors())
    .use(cookie())
    .use(PublicRoutes) // these routes do not require authentication
    .use(AuthPlugin) // this sets the user object in the request context andy will throw an error if the user is not authenticated
    .use(EndpointRoutes) // all routes below this line require authentication
    .listen(config.port);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export type Server = typeof app;
