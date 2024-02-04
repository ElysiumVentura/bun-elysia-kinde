import { describe, expect, test, afterEach } from "bun:test";
import { SessionManager, Session, redis } from "..";
import UUIDMock from "../misc/UUID/UUID.mock";

describe("SessionManager", () => {
    afterEach(async () => {
        UUIDMock.reset();
        await SessionManager.destroyAllSessions();
    });

    describe("creating a new session", async () => {
        test("returns a new Session instance", async () => {
            const session = await SessionManager.createSession(Date.now());
            expect(session).toBeInstanceOf(Session);
        });
        test("sets `created` to the time passed during creation", async () => {
            const date = Date.now();
            const session = await SessionManager.createSession(date);

            expect(session).toBeInstanceOf(Session);
            expect(await redis.hget("0-0-0-0-1", "created")).toBe(date.toString());
        });
    });

    describe("retrieving a session", () => {
        test("returns a Session instance if the sessionId passed matches an existing session", async () => {
            await SessionManager.createSession(Date.now());
            const session = await SessionManager.getSession("0-0-0-0-1");
            expect(session).toBeInstanceOf(Session);
        });
        test("throws an error if the sessionId passed does not match an existing session", async () => {
            const sessionId = "0-0-0-0-1";
            return expect(SessionManager.getSession(sessionId)).rejects.toThrow(`Session with ID ${sessionId} does not exist`);
        });
    });

    describe("destroying a session", () => {
        test("throws an error if the sessionId passed does not match an existing session", async () => {
            const sessionId = "0-0-0-0-1";
            expect(SessionManager.destroySession(sessionId)).rejects.toThrow(`Session with ID ${sessionId} does not exist`);
        });
        test("deletes the session if the sessionId passed matches an existing session", async () => {
            const date = Date.now();
            await SessionManager.createSession(date);
            await SessionManager.destroySession("0-0-0-0-1");
            expect(redis.exists("0-0-0-0-1")).resolves.toBe(0);
        });
    });

    describe("destroying all sessions", () => {
        test("deletes all sessions", async () => {
            const date = Date.now();
            await SessionManager.createSession(date);
            await SessionManager.createSession(date);
            await SessionManager.destroyAllSessions();
            expect(redis.exists("0-0-0-0-1")).resolves.toBe(0);
            expect(redis.exists("0-0-0-0-2")).resolves.toBe(0);
        });
    });
});
