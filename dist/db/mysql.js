"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.escape = exports.exec = void 0;
const mysql_1 = __importDefault(require("mysql"));
const db_1 = require("../config/db");
console.log('MYSQL_CONFIG', db_1.MYSQL_CONFIG);
// 1. 创建连接对象【单例模式】
const con = mysql_1.default.createConnection(db_1.MYSQL_CONFIG);
// 2. 开始连接
con.connect();
// 3. 执行 sql 语句
function exec(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err)
                reject(err);
            resolve(result);
        });
    });
}
exports.exec = exec;
// 4. 防止 sql注入攻击
exports.escape = mysql_1.default.escape;
// 5. 保持连接
// con.end();
