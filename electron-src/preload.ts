/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  ipcRenderer,
  IpcRenderer,
  contextBridge,
  IpcRendererEvent,
} from "electron";

declare global {
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer;
    }
  }
}

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    on: (
      channel: string,
      callback: (event: IpcRendererEvent, ...args: any[]) => void
    ) => ipcRenderer.on(channel, (event, data) => callback(event, data)),
    removeListener: (channel: string, callback: (...args: any[]) => void) =>
      ipcRenderer.removeListener(channel, callback),
    invoke: (channel: string, ...args: any[]) =>
      ipcRenderer.invoke(channel, ...args), // ✅ 수정: invoke를 Promise 반환 방식으로 설정
  },
});

// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once("loaded", () => {
  global.ipcRenderer = ipcRenderer;
});
