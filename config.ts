export default {
    serverUrl: process.env.SERVER_URL ?? "http://localhost",
    port: process.env.PORT ?? 3000,

    kinde: {
        domain: process.env.KINDE_DOMAIN ?? "",
        clientId: process.env.KINDE_CLIENT_ID ?? "",
        clientSecret: process.env.KINDE_CLIENT_SECRET ?? "",
        redirectUri: process.env.KINDE_REDIRECT_URI ?? "",
        logoutUri: process.env.KINDE_LOGOUT_REDIRECT_URI ?? "",
    },
};
