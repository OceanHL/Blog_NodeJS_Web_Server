"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
// 密钥
const SECRET_KEY = "James_2021/9/27";
// md5 加密算法生成一个32位16进制字符串
function md5(content) {
    const md5 = crypto_1.default.createHash("md5");
    return md5.update(content).digest("hex"); // 变成16进制
}
// 加密函数，返回32位长度字符串
function getPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`;
    return md5(str);
}
exports.getPassword = getPassword;
