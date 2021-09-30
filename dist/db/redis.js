"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSession = exports.setSession = void 0;
const redis_1 = __importDefault(require("redis"));
const db_1 = require("../config/db");
// 1. 创建客户端
const redisClient = redis_1.default.createClient(db_1.REDIS_CONFIG);
redisClient.on("error", err => console.error(err));
function setSession(key, value) {
    if (typeof value === "object") {
        value = JSON.stringify(value);
    }
    redisClient.set(key, value, redis_1.default.print);
}
exports.setSession = setSession;
function getSession(key) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, value) => {
            if (err)
                return reject(err);
            // 没找到
            if (value == null)
                return resolve(null);
            try {
                resolve(JSON.parse(value));
            }
            catch (e) {
                resolve(value);
            }
            /* 单例模式，不需要退出 redis */
            // 退出 redis
            // redisClient.quit();
        });
    });
}
exports.getSession = getSession;
