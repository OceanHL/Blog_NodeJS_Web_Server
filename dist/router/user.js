"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUserRouter = void 0;
const user_1 = require("../controller/user");
const resModel_1 = require("../model/resModel");
const redis_1 = require("../db/redis");
const handleUserRouter = (req, res) => {
    const method = req.method; // GET POST
    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body ?? {};
        // const { username, password } = req.query ?? {};
        console.log('req.body', req.body);
        console.log(username, password);
        const result = (0, user_1.login)(username, password);
        return result.then(userInfo => {
            // 判断 username 是否有值
            if (userInfo.username) {
                // 设置 session
                if (req.session) {
                    // 有该属性就覆盖为新的，没有就设置
                    req.session.username = userInfo.username;
                    req.session.realname = userInfo.realname;
                    (0, redis_1.setSession)(req.sessionID, req.session);
                }
                console.log('session: ', req.session);
                return new resModel_1.SuccessModel();
            }
            else
                return new resModel_1.ErrorModel('登录失败');
        });
    }
    // // 登录验证的测试
    // if (method === 'GET' && req.path === "/api/user/login-test") {
    //     if (req.session?.username) return Promise.resolve(new SuccessModel({
    //         session: req.session
    //     }));
    //     return Promise.resolve(new ErrorModel("尚未登录"));
    // }
};
exports.handleUserRouter = handleUserRouter;
