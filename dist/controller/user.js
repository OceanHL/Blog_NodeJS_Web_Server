"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const mysql_1 = require("../db/mysql");
const cryp_1 = require("../utils/cryp");
const login = (username, password) => {
    // 输入用户名为：zhangsan'-- 后面有一个空格，会成功登入
    /*
    *  输入用户名为：zhangsan'-- 后面有一个空格，会成功登入
    *  输入 zhangsan';delete from users;-- ，非常危险
    * */
    username = (0, mysql_1.escape)(username);
    // 生成加密密码
    password = (0, cryp_1.getPassword)(password ?? "");
    password = (0, mysql_1.escape)(password); // 用 escape 函数包裹，在 sql 中可以省略 ''
    const sql = `
        select username, realname from users where username=${username} and password=${password};
    `;
    console.log('sql is: ', sql);
    return (0, mysql_1.exec)(sql).then(userInfoList => userInfoList[0] ?? {});
};
exports.login = login;
