import mysql from "mysql";
import {MYSQL_CONFIG} from "../config/db";

console.log('MYSQL_CONFIG', MYSQL_CONFIG);

// 1. 创建连接对象【单例模式】
const con = mysql.createConnection(MYSQL_CONFIG);

// 2. 开始连接
con.connect();

// 3. 执行 sql 语句
export function exec<ResultType = any>(sql: string): Promise<ResultType> {
    return new Promise<ResultType>((resolve, reject) => {
        con.query(sql, (err, result: ResultType) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

// 4. 防止 sql注入攻击
export const escape = mysql.escape;

// 5. 保持连接
// con.end();