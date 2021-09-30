#!/bin/sh
cd C:\Users\JHL\Desktop\project\node+express+koa2 - 博客系统\blog-1\src\logs
cp access.log $(date +%Y-%m-%d-%H).access.log
echo "" > access.log