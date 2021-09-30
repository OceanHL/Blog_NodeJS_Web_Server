"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
// 文件名
const fileName = path_1.default.join(__dirname, '../', 'logs', 'access.log');
// 创建 ReadStream 对象
const readStream = fs_1.default.createReadStream(fileName);
// 创建一个 readline 对象
const rl = readline_1.default.createInterface({
    input: readStream
});
let edgeNum = 0; // Edge浏览器的访问数量
let sum = 0; // 总访问量
// 逐行读取
rl.on("line", (lineData) => {
    if (!lineData)
        return;
    // 记录总行数
    sum++;
    const arr = lineData.split(' -- ');
    // 获取 user-agent 信息，并累加 Edge 的数量
    if (arr[2] && arr[2].includes("Edg"))
        edgeNum++;
});
// 监听读取完成
rl.on("close", () => {
    console.log('Edge 占比：', edgeNum / sum);
});
