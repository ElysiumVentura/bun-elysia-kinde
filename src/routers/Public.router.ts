import { createKindeServerClient, GrantType } from "@kinde-oss/kinde-typescript-sdk";
import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import config from "../../config";
import { SessionManager } from "../helpers";

const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
    authDomain: config.kinde.domain,
    clientId: config.kinde.clientId,
    clientSecret: config.kinde.clientSecret,
    redirectURL: config.kinde.redirectUri,
    logoutRedirectURL: config.kinde.logoutUri,
});

const PublicRoutes = new Elysia()
    .use(cookie())
    .get("/", async () => {
        return "Hello, World!";
    })
    .get("/login", async ({ set, setCookie }) => {
        const session = await SessionManager.createSession(Date.now());
        const loginUrl = await kindeClient.login(session);

        setCookie("sessionId", session.sessionId, {
            httpOnly: true,
        });

        set.redirect = loginUrl.toString();
    })
    .get("/login-success", async ({ cookie: { sessionId }, set, path, query }) => {
        const session = await SessionManager.getSession(sessionId);

        if (session) {
            const url = new URL(`${config.serverUrl}:${config.port}${path}?code=${query.code}&scope=${query.scope}&state=${query.state}`);
            await kindeClient.handleRedirectToApp(session, url);

            set.redirect = "/test";
        } else {
            throw new Error("Session not found");
        }
    })
    .get("/test", async () => {
        return "Test";
    });

export default PublicRoutes;
