/*
* createServer 信息
* */
import http from "http";
import serverHandle from "../app";

const POST = 3000;

const server = http.createServer(serverHandle);

server.listen(POST, () => {
    console.log(`服务启动在: http://localhost:${POST}`);
});