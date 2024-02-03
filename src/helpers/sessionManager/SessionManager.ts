import { Redis } from "../redis/Redis";

type UUIDGenerator = typeof crypto.randomUUID;

export class Session {
    private redis: Redis;

    constructor(public sessionId: string, redis: Redis) {
        this.sessionId = sessionId;
        this.redis = redis;
    }

    public async getSessionItem(key: string): Promise<unknown> {
        const value = await this.redis.hget(this.sessionId, key);
        return value !== null ? JSON.parse(value) : null;
    }

    public async setSessionItem(key: string, value: unknown): Promise<void> {
        await this.redis.hset(this.sessionId, key, JSON.stringify(value));
    }

    public async removeSessionItem(key: string): Promise<void> {
        await this.redis.hdel(this.sessionId, key);
    }

    public async destroySession(): Promise<void> {
        await this.redis.del(this.sessionId);
    }
}

export class SessionManager {
    private redis: Redis;
    private uuidGenerator: UUIDGenerator;

    constructor(redis: Redis, uuidGenerator: UUIDGenerator) {
        this.redis = redis;
        this.uuidGenerator = uuidGenerator;
    }

    public createSession = async (date: number): Promise<Session> => {
        const sessionId = this.uuidGenerator();
        const session = new Session(sessionId, this.redis);

        await this.redis.hset(sessionId, "created", date);

        return session;
    };

    public getSession(sessionId: string): Session {
        return new Session(sessionId, this.redis);
    }

    public destroySession(sessionId: string): void {
        this.redis.del(sessionId);
    }
}
