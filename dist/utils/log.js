"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeEventLog = exports.writeErrorLog = exports.writeAccessLog = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// 写日志
function writeLog(writeStream, log) {
    writeStream.write(log + '\n'); // 关键代码
}
// 生产 write stream【第二个水桶】
function createWriteStream(fileName) {
    const fullFileName = path_1.default.join(__dirname, '../', 'logs', fileName);
    return fs_1.default.createWriteStream(fullFileName, {
        flags: 'a', // a - 追加，w - 覆盖
    });
}
// 写访问日志
const accessWriteStream = createWriteStream('access.log');
const errorWriteStream = createWriteStream('error.log');
const eventWriteStream = createWriteStream('event.log');
function writeAccessLog(log) {
    writeLog(accessWriteStream, log);
}
exports.writeAccessLog = writeAccessLog;
function writeErrorLog(log) {
    writeLog(errorWriteStream, log);
}
exports.writeErrorLog = writeErrorLog;
function writeEventLog(log) {
    writeLog(eventWriteStream, log);
}
exports.writeEventLog = writeEventLog;
