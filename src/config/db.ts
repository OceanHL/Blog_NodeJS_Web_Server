import {ConnectionConfig} from "mysql";
import {ClientOpts} from "redis";

// 1. 获取环境变量
const env = process.env.NODE_ENV;

// 2. 根据不同的 环境变量 进行不同的配置，【导出该变量的引用，后面可以对该变量进行修改】
export let MYSQL_CONFIG: ConnectionConfig;
export let REDIS_CONFIG: ClientOpts ;

if (env === 'development') {
    // mysql
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: 'a12345',
        port: 3306,
        database: 'myblog'
    }
    // redis
    REDIS_CONFIG = {
        port: 6379,
        host: '127.0.0.1'
    }
}

if (env === 'production') {
    // mysql
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: 'a12345',
        port: 3306,
        database: 'myblog'
    }
    // redis
    REDIS_CONFIG = {
        port: 6379,
        host: '127.0.0.1'
    }
}