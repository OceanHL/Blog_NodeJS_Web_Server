/*
* 只关心路由有关的数据
* */
import {MyRequestListener, MyIncomingMessage} from "types";
import {BlogInfo, BlogId, getDetail, getList, newBlog, updateBlog, delBlog} from "../controller/blog";
import {SuccessModel,ErrorModel} from "../model/resModel";

type DataType = BlogInfo[] |  BlogInfo |  BlogId;
type ReturnType = Promise<SuccessModel<DataType> | ErrorModel> | undefined

export interface BodyType {
    title: string;
    content: string;
    author: string;
}

//统一的登录验证函数
const loginCheck = (req: MyIncomingMessage): Promise<ErrorModel> | undefined => {
    // 如果没有username
    console.log('loginCheck中的验证', req.session?.username, !req.session?.username)
    if (!req.session?.username) {
        return Promise.resolve(new ErrorModel("尚未登录"));
    }
}

export const handleBlogRouter: MyRequestListener<ReturnType, BodyType> = (req) => {
    const method = req.method; // GET POST
    const id = req.query?.id ?? 0; // 获取 id(number)

    //  获取博客列表
    if (method === "GET" && req.path === "/api/blog/list") {
        let author  = (req.query?.author ?? '') as string;
        const keyword = (req.query?.keyword ?? '') as string;
        
        if (req.query?.isadmin) {
            // 管理员界面
            const loginCheckResult = loginCheck(req);
            if (loginCheckResult) return loginCheckResult;
            author = req.session?.username;
        }

        const result = getList(author, keyword);
        // 返回一个promise
        return result.then(listData => new SuccessModel(listData));
    }

    // 获取博客详情
    if(method === "GET" && req.path=== "/api/blog/detail") {
        // const data = getDetail(id);
        // return new SuccessModel(data);
        const result = getDetail(Number(id));
        return result.then(blogInfo => new SuccessModel(blogInfo));
    }

    // 新建一篇博客
    if(method === "POST" && req.path=== "/api/blog/new") {
        // const author = 'zhangsan'; // 假数据，待开发登录时再改为真实数据

        /* 登录验证 */
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 有值，则说明【未登录】，把 ErrorModel("尚未登录") 返回出去
            return loginCheckResult
        }

        if (req.body) {
            req.body.author = req.session?.username;
            const result = newBlog(req.body);
            return result.then(blogId => new SuccessModel(blogId));
        }
    }

    // 更新一篇博客
    if(method === "POST" && req.path=== "/api/blog/update") {
        /* 登录验证 */
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 有值，则说明【未登录】，把 ErrorModel("尚未登录") 返回出去
            return loginCheckResult
        }

        const result = updateBlog(Number(id), req.body);
        return result.then(data => data ? new SuccessModel() : new ErrorModel("更新博客失败"));
    }

    // 删除一篇博客
    if(method === "POST" && req.path=== "/api/blog/del") {
        /* 登录验证 */
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 有值，则说明【未登录】，把 ErrorModel("尚未登录") 返回出去
            return loginCheckResult
        }

        const author = req.session?.username; // 假数据，待开发登录时再改为真实数据
        const result = delBlog(Number(id), author);
        return result.then(data => data ? new SuccessModel() : new ErrorModel("删除博客失败"));
    }
}

