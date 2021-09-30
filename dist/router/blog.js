"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBlogRouter = void 0;
const blog_1 = require("../controller/blog");
const resModel_1 = require("../model/resModel");
//统一的登录验证函数
const loginCheck = (req) => {
    // 如果没有username
    console.log('loginCheck中的验证', req.session?.username, !req.session?.username);
    if (!req.session?.username) {
        return Promise.resolve(new resModel_1.ErrorModel("尚未登录"));
    }
};
const handleBlogRouter = (req) => {
    const method = req.method; // GET POST
    const id = req.query?.id ?? 0; // 获取 id(number)
    //  获取博客列表
    if (method === "GET" && req.path === "/api/blog/list") {
        let author = (req.query?.author ?? '');
        const keyword = (req.query?.keyword ?? '');
        if (req.query?.isadmin) {
            // 管理员界面
            const loginCheckResult = loginCheck(req);
            if (loginCheckResult)
                return loginCheckResult;
            author = req.session?.username;
        }
        const result = (0, blog_1.getList)(author, keyword);
        // 返回一个promise
        return result.then(listData => new resModel_1.SuccessModel(listData));
    }
    // 获取博客详情
    if (method === "GET" && req.path === "/api/blog/detail") {
        // const data = getDetail(id);
        // return new SuccessModel(data);
        const result = (0, blog_1.getDetail)(Number(id));
        return result.then(blogInfo => new resModel_1.SuccessModel(blogInfo));
    }
    // 新建一篇博客
    if (method === "POST" && req.path === "/api/blog/new") {
        // const author = 'zhangsan'; // 假数据，待开发登录时再改为真实数据
        /* 登录验证 */
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 有值，则说明【未登录】，把 ErrorModel("尚未登录") 返回出去
            return loginCheckResult;
        }
        if (req.body) {
            req.body.author = req.session?.username;
            const result = (0, blog_1.newBlog)(req.body);
            return result.then(blogId => new resModel_1.SuccessModel(blogId));
        }
    }
    // 更新一篇博客
    if (method === "POST" && req.path === "/api/blog/update") {
        /* 登录验证 */
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 有值，则说明【未登录】，把 ErrorModel("尚未登录") 返回出去
            return loginCheckResult;
        }
        const result = (0, blog_1.updateBlog)(Number(id), req.body);
        return result.then(data => data ? new resModel_1.SuccessModel() : new resModel_1.ErrorModel("更新博客失败"));
    }
    // 删除一篇博客
    if (method === "POST" && req.path === "/api/blog/del") {
        /* 登录验证 */
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 有值，则说明【未登录】，把 ErrorModel("尚未登录") 返回出去
            return loginCheckResult;
        }
        const author = req.session?.username; // 假数据，待开发登录时再改为真实数据
        const result = (0, blog_1.delBlog)(Number(id), author);
        return result.then(data => data ? new resModel_1.SuccessModel() : new resModel_1.ErrorModel("删除博客失败"));
    }
};
exports.handleBlogRouter = handleBlogRouter;
