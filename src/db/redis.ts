import redis from "redis";
import {REDIS_CONFIG} from "../config/db";

// 1. 创建客户端
const redisClient = redis.createClient(REDIS_CONFIG);
redisClient.on("error", err => console.error(err));

export function setSession(key: string, value: string | {[key: string]: any}) {
    if (typeof value === "object") {
        value = JSON.stringify(value);
    }
    redisClient.set(key, value, redis.print);
}

export function getSession<ReturnData = any>(key: string): Promise< ReturnData | null > {
    return new Promise<any>((resolve, reject) => {
        redisClient.get(key, (err, value) => {
            if (err) return reject(err);
            // 没找到
            if (value == null) return resolve(null);
            try {
                resolve(JSON.parse(value));
            } catch (e) {
                resolve(value);
            }
            /* 单例模式，不需要退出 redis */
            // 退出 redis
            // redisClient.quit();
        })
    });
}