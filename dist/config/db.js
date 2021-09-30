"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_CONFIG = exports.MYSQL_CONFIG = void 0;
// 1. 获取环境变量
const env = process.env.NODE_ENV;
if (env === 'development') {
    // mysql
    exports.MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: 'a12345',
        port: 3306,
        database: 'myblog'
    };
    // redis
    exports.REDIS_CONFIG = {
        port: 6379,
        host: '127.0.0.1'
    };
}
if (env === 'production') {
    // mysql
    exports.MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: 'a12345',
        port: 3306,
        database: 'myblog'
    };
    // redis
    exports.REDIS_CONFIG = {
        port: 6379,
        host: '127.0.0.1'
    };
}
