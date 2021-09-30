import fs from "fs";
import path from "path";
import readline from "readline";

// 文件名
const fileName = path.join(__dirname, '../', 'logs', 'access.log');

// 创建 ReadStream 对象
const readStream = fs.createReadStream(fileName);

// 创建一个 readline 对象
const rl = readline.createInterface({
    input: readStream
})

let edgeNum = 0; // Edge浏览器的访问数量
let sum = 0; // 总访问量

// 逐行读取
rl.on("line", (lineData: string) => {
    if (!lineData) return

    // 记录总行数
    sum++;

    const arr = lineData.split(' -- ');
    // 获取 user-agent 信息，并累加 Edge 的数量
    if (arr[2] && arr[2].includes("Edg")) edgeNum++;
})

// 监听读取完成
rl.on("close", () => {
    console.log('Edge 占比：', edgeNum / sum);
})