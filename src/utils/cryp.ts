import crypto from "crypto";

// 密钥
const SECRET_KEY = "James_2021/9/27";

// md5 加密算法生成一个32位16进制字符串
function md5(content: string) {
    const md5 = crypto.createHash("md5");
    return md5.update(content).digest("hex"); // 变成16进制
}

// 加密函数，返回32位长度字符串
export function getPassword(password: string) {
    const str = `password=${password}&key=${SECRET_KEY}`;
    return md5(str);
}

