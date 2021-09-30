"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
* createServer 信息
* */
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("../app"));
const POST = 3000;
const server = http_1.default.createServer(app_1.default);
server.listen(POST, () => {
    console.log(`服务启动在: http://localhost:${POST}`);
});
