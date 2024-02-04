import { randomUUID } from "crypto";
import redis from "../redis/Redis";

export class Session {
    constructor(public sessionId: string) {
        this.sessionId = sessionId;
    }

    public async getSessionItem(key: string): Promise<unknown> {
        const value = await redis.hget(this.sessionId, key);
        return value !== null ? JSON.parse(value) : null;
    }

    public async setSessionItem(key: string, value: unknown): Promise<void> {
        await redis.hset(this.sessionId, key, JSON.stringify(value));
    }

    public async removeSessionItem(key: string): Promise<void> {
        await redis.hdel(this.sessionId, key);
    }

    public async destroySession(): Promise<void> {
        await redis.del(this.sessionId);
    }
}

export class SessionManager {
    private static sessionIdsKey = "sessionIds";

    public static createSession = async (date: number): Promise<Session> => {
        const sessionId = randomUUID();
        const session = new Session(sessionId);
        await redis.sadd(this.sessionIdsKey, sessionId);

        // console.log("createSession - ", sessionId, " - ", date);

        await redis.hset(sessionId, "created", date);

        return session;
    };

    public static async getSession(sessionId: string): Promise<Session> {
        const exists = await redis.exists(sessionId);
        if (!exists) {
            throw new Error(`Session with ID ${sessionId} does not exist`);
        }

        return new Session(sessionId);
    }

    public static async destroySession(sessionId: string): Promise<void> {
        const exists = await redis.exists(sessionId);
        if (!exists) {
            throw new Error(`Session with ID ${sessionId} does not exist`);
        }

        await redis.del(sessionId);
        await redis.srem(this.sessionIdsKey, sessionId);
        // return;
    }

    public static async destroyAllSessions(): Promise<void> {
        const sessionIds = await redis.smembers(this.sessionIdsKey);

        for (const sessionId of sessionIds) {
            this.destroySession(sessionId);
        }

        await redis.del(this.sessionIdsKey);
    }

    public static async getAllSessions(): Promise<Session[]> {
        const sessionIds = await redis.smembers(this.sessionIdsKey);

        return Promise.all(sessionIds.map((sessionId) => this.getSession(sessionId)));
    }
}
