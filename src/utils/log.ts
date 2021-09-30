import fs, { WriteStream } from "fs";
import path from "path";

// 写日志
function writeLog(writeStream: WriteStream, log: string): void {
    writeStream.write(log + '\n'); // 关键代码
}

// 生产 write stream【第二个水桶】
function createWriteStream(fileName: string): WriteStream {
    const fullFileName = path.join(__dirname, '../', 'logs', fileName);
    return fs.createWriteStream(fullFileName, {
        flags: 'a', // a - 追加，w - 覆盖
    });
}

// 写访问日志
const accessWriteStream = createWriteStream('access.log');
const errorWriteStream = createWriteStream('error.log');
const eventWriteStream = createWriteStream('event.log');

export function writeAccessLog(log: string): void {
    writeLog(accessWriteStream, log);
}
export function writeErrorLog(log: string): void {
    writeLog(errorWriteStream, log);
}
export function writeEventLog(log: string): void {
    writeLog(eventWriteStream, log);
}