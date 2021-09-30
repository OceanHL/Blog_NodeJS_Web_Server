"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delBlog = exports.updateBlog = exports.newBlog = exports.getDetail = exports.getList = void 0;
const mysql_1 = require("../db/mysql");
const xss_1 = __importDefault(require("xss"));
// xxx.html?a=1&k1=v1&k2=v2&k3=v3  利用 a=1 占住开头，这样后面的格式就统一了
// 获取博客列表数据
const getList = (author, keyword) => {
    // 没有 author 就返回所有的 博客数据
    let sql = `select * from blogs where 1=1 `; // 1=1 的意义：防止 where 后面没有值
    if (author)
        sql += `and author=${author} `;
    if (keyword)
        sql += `and title like '%${keyword}%' `;
    sql += `order by createtime desc`; // 降序排列
    console.log('sql is: ', sql);
    // 返回 promise
    return (0, mysql_1.exec)(sql);
};
exports.getList = getList;
// 获取博客详情
function getDetail(id) {
    const blogId = (0, mysql_1.escape)(id);
    const sql = `select * from blogs where id = ${blogId}`;
    return (0, mysql_1.exec)(sql).then(blogList => blogList[0]);
}
exports.getDetail = getDetail;
// 创建新博客
function newBlog(blogData) {
    // blogData 是一个博客对象，包含 title content 属性
    const title = (0, xss_1.default)(blogData?.title ?? "");
    console.log('title', title);
    const content = (0, xss_1.default)(blogData?.content ?? "");
    const author = blogData?.author;
    const createTime = Date.now();
    const sql = `insert into blogs(title, content, createtime, author) values('${title}', '${content}', ${createTime}, '${author}');`;
    console.log('sql is: ', sql);
    // 表示新建博客，插入到数据表里面的 id
    return (0, mysql_1.exec)(sql).then(okPacket => ({ id: okPacket.insertId }));
}
exports.newBlog = newBlog;
//  更新一个博客
function updateBlog(id, blogData) {
    // id 就是要更新的博客 id
    // blogData 是一个博客对象，包含 title content 属性
    // console.log('update blog', id, blogData);
    const title = (0, xss_1.default)(blogData?.title ?? "");
    const content = (0, xss_1.default)(blogData?.content ?? "");
    const sql = `update blogs set title=${title}, content=${content} where 1=1 and id=${id}`;
    return (0, mysql_1.exec)(sql).then(okPacked => okPacked.changedRows > 0);
}
exports.updateBlog = updateBlog;
// 删除一个博客
function delBlog(id, author) {
    const blogId = (0, mysql_1.escape)(id);
    author = (0, mysql_1.escape)(author);
    // id 就是要删除的博客 id
    const sql = `delete from blogs where id=${blogId} and author='${author}'`;
    return (0, mysql_1.exec)(sql).then(okPacked => okPacked.affectedRows > 0);
}
exports.delBlog = delBlog;
