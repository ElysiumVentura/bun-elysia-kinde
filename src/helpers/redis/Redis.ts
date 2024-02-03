import ioRedis from "ioredis";

const redis = new ioRedis();

export default redis;
export type Redis = typeof redis;
