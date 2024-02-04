import { mock } from "bun:test";
import redisMock from "./src/helpers/redis/Redis.mock";
import UUIDMock from "./src/helpers/misc/UUID/UUID.mock";

mock.module("crypto", () => {
    return { randomUUID: UUIDMock.generateUUID.bind(UUIDMock) };
});

mock.module("./src/helpers/redis/Redis.ts", () => {
    return { default: redisMock };
});
