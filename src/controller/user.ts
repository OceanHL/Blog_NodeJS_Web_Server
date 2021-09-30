import { exec, escape } from "../db/mysql";
import {getPassword} from "../utils/cryp";

interface UserInfo {
    id?: number;
    username?: string;
    realname?: string;
    password?: string;
}

export const login = (username?: string, password?: string) => {
    // 输入用户名为：zhangsan'-- 后面有一个空格，会成功登入
    /*
    *  输入用户名为：zhangsan'-- 后面有一个空格，会成功登入
    *  输入 zhangsan';delete from users;-- ，非常危险
    * */
    username = escape(username);
    // 生成加密密码
    password = getPassword(password ?? "");
    password = escape(password); // 用 escape 函数包裹，在 sql 中可以省略 ''

    const sql = `
        select username, realname from users where username=${username} and password=${password};
    `;
    console.log('sql is: ', sql);

    return exec<UserInfo[]>(sql).then(userInfoList => userInfoList[0] ?? {});
}