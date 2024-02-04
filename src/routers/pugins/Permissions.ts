import { Elysia } from "elysia";
import { AuthPlugin } from ".";

const Auth = new Elysia().use(AuthPlugin).macro(({ onBeforeHandle }) => {
    return {
        permission(permission: string) {
            onBeforeHandle(({ permissions }) => {
                console.log(permissions, permission);
                if (!permissions.includes(permission)) {
                    throw new Error(`User does not have permission to ${permission}`);
                }
            });
        },
    };
});

export default Auth;
