import { BodyType } from "router/blog";
import {escape, exec} from "../db/mysql";
import {OkPacket} from "mysql";
import xss from "xss";




export interface BlogInfo {
    id: number;
    title: string;
    content: string;
    createTime: number;
    author: string;
}

export type BlogId = Pick<BlogInfo, "id">;

type SimpleBlogInfo = Omit<BlogInfo, "id" | "createTime">;

// xxx.html?a=1&k1=v1&k2=v2&k3=v3  利用 a=1 占住开头，这样后面的格式就统一了
// 获取博客列表数据
export const getList = (author?: string, keyword?: string): Promise<BlogInfo[]> => {
    // 没有 author 就返回所有的 博客数据
    let sql = `select * from blogs where 1=1 `; // 1=1 的意义：防止 where 后面没有值
    if (author) sql += `and author=${author} `;
    if (keyword) sql += `and title like '%${keyword}%' `;
    sql += `order by createtime desc`; // 降序排列
    console.log('sql is: ', sql)

    // 返回 promise
    return exec<BlogInfo[]>(sql);
}

// 获取博客详情
export function getDetail(id: number): Promise<BlogInfo>  {
    const blogId = escape(id);
    const sql = `select * from blogs where id = ${blogId}`;
    return exec<BlogInfo[]>(sql).then(blogList => blogList[0]);
}

// 创建新博客
export function newBlog<T extends SimpleBlogInfo = any>(blogData?: T): Promise<BlogId> {
    // blogData 是一个博客对象，包含 title content 属性
    const title = xss(blogData?.title ?? "");
    console.log('title', title);
    const content = xss(blogData?.content ?? "");
    const author = blogData?.author;
    const createTime = Date.now();

    const sql = `insert into blogs(title, content, createtime, author) values('${title}', '${content}', ${createTime}, '${author}');`;
    console.log('sql is: ', sql);
    // 表示新建博客，插入到数据表里面的 id
    return exec<OkPacket>(sql).then(okPacket => ({id: okPacket.insertId}));
}

//  更新一个博客
export function updateBlog<T extends BodyType>(id: number, blogData?: T): Promise<boolean> {
    // id 就是要更新的博客 id
    // blogData 是一个博客对象，包含 title content 属性
    // console.log('update blog', id, blogData);
    const title = xss(blogData?.title ?? "");
    const content = xss(blogData?.content ?? "");

    const sql = `update blogs set title=${title}, content=${content} where 1=1 and id=${id}`;
    return exec<OkPacket>(sql).then(okPacked => okPacked.changedRows > 0);
}

// 删除一个博客
export function delBlog(id: number, author: string): Promise<boolean> {
    const blogId = escape(id);
    author = escape(author);
    // id 就是要删除的博客 id
    const sql = `delete from blogs where id=${blogId} and author='${author}'`;

    return exec<OkPacket>(sql).then(okPacked => okPacked.affectedRows > 0);
}