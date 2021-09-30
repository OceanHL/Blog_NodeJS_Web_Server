"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = __importDefault(require("querystring"));
const router_1 = require("./router");
const router_2 = require("./router");
const redis_1 = require("./db/redis");
const log_1 = require("./utils/log");
/*
 *   基本设置聚集地
 * */
// session 数据
// const SESSION_DATA: {[key: string]: any} = {}; // 查找选Object，其他均选Map
// 获取 cookie 的过期时间
function getCookieExpires() {
    const d = new Date();
    // 1000 毫秒是 1秒
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    console.log('d.toUTCString() is', d.toUTCString());
    return d.toUTCString();
}
/**
 *
 * @param req
 */
function getPostData(req) {
    const promise = new Promise(resolve => {
        if (req.method !== 'POST' || !req.headers['content-type']?.includes('application/json'))
            return resolve({});
        let postData = '';
        req.on('data', chunk => {
            postData += chunk;
        });
        req.on('end', () => {
            if (!postData)
                return resolve({});
            resolve(JSON.parse(postData));
        });
    });
    return promise;
}
const serverHandle = (req, res) => {
    // 记录 access log
    (0, log_1.writeAccessLog)(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`);
    //  设置返回格式 JSON
    res.setHeader('Content-type', 'application/json');
    // 获取 path
    const url = req.url;
    req.path = url.split('?')[0];
    console.log('url', url);
    // 解析 query
    req.query = querystring_1.default.parse(url.split('?')[1]);
    // 解析 cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie ?? '';
    cookieStr.split(';').forEach(item => {
        // 如果item为空串，则直接退出
        if (!item)
            return;
        const arr = item.split('=');
        const key = arr[0].trim();
        const value = arr[1].trim();
        console.log(key, value);
        if (req.cookie)
            req.cookie[key] = value;
    });
    // 解析 session
    /*
     *   1. 先从cookie中取出 userId
     *   2. 如果有 userId, 并且 SESSION_DATA 没有该属性，则初始化一个
     *   3. 没有 userId，创建一个userId, 并进行初始化
     * */
    let needSetCookie = false; // 是否需要设置cookie，没有 userId，则需要设置cookie
    let userId = (req.sessionID = req.cookie.userId);
    if (userId) {
        // 查看 cookie 中 是否有 userId
        if (!(0, redis_1.getSession)(userId)) {
            (0, redis_1.setSession)(userId, {});
        }
    }
    else {
        // 没有 userId，需要设置cookie
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        (0, redis_1.setSession)(userId, {}); // 第一次设置为一个空对象
    }
    // req.session是userId指向的对象
    (0, redis_1.getSession)(userId).then(session => {
        console.log('app.ts中获取session', session);
        req.session = session;
        // 处理 post data
        getPostData(req).then(postData => {
            req.body = postData;
            //  处理 blog 路由
            // const blogData = handleBlogRouter(req, res);
            // if (blogData) return res.end(JSON.stringify(blogData));
            const blogResult = (0, router_1.handleBlogRouter)(req, res);
            if (blogResult)
                return blogResult.then(blogData => {
                    if (needSetCookie) {
                        // 只有第一次设置cookie
                        // 操作 cookie，path默认是当前父路径，如：/【网页的所有路径都可获取】
                        res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
                    }
                    return res.end(JSON.stringify(blogData));
                });
            // 处理 user 路由
            // const userData = handleUserRouter(req,res);
            // if(userData) return res.end(JSON.stringify(userData));
            const userResult = (0, router_2.handleUserRouter)(req, res);
            if (userResult)
                return userResult.then(userData => {
                    if (needSetCookie) {
                        // 操作 cookie，path默认是当前父路径，如：/【网页的所有路径都可获取】
                        res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
                    }
                    return res.end(JSON.stringify(userData));
                });
            // 未命中路由，返回 404
            res.writeHead(404, { 'Content-type': 'text/plain' });
            res.write('404 Not Fount\n'); // 写入内容
            res.end();
        });
    });
};
exports.default = serverHandle;
// process.env.NODE_ENV
