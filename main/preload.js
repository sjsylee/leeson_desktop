"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electron", {
    ipcRenderer: {
        send: (channel, data) => electron_1.ipcRenderer.send(channel, data),
        on: (channel, callback) => electron_1.ipcRenderer.on(channel, (event, data) => callback(event, data)),
        removeListener: (channel, callback) => electron_1.ipcRenderer.removeListener(channel, callback),
        invoke: (channel, ...args) => electron_1.ipcRenderer.invoke(channel, ...args), // ✅ 수정: invoke를 Promise 반환 방식으로 설정
    },
});
// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once("loaded", () => {
    global.ipcRenderer = electron_1.ipcRenderer;
});
