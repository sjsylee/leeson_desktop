// Native
import path, { join } from "path";

// Packages
import { BrowserWindow, app, ipcMain, dialog } from "electron";
import isDev from "electron-is-dev";

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import log from "electron-log";
import { autoUpdater } from "electron-updater";
import * as fs from "fs";

const nextApp = next({ dev: isDev, dir: app.getAppPath() + "/renderer" });
const handle = nextApp.getRequestHandler();

let mainWindow: BrowserWindow | null = null;
let updateWindow: BrowserWindow | null = null;

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await nextApp.prepare();

  createServer((req: any, res: any) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(4444, () => {
    console.log("> Ready on http://localhost:4444/home");
  });

  mainWindow = new BrowserWindow({
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 15, y: 12 }, // 크롬 아이콘 위치 정도로 버튼 위치 설정
    width: 1400,
    height: 960,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: join(__dirname, "preload.js"),
    },
  });

  // * 업데이트 확인 *
  checkForUpdates();

  mainWindow.loadURL("http://localhost:4444/home");

  // * 화면 크기 조정 *

  // ✅ 요청을 받으면 창 크기를 확대하는 이벤트 리스너 등록
  ipcMain.on("expand-window", (_, { width, height }) => {
    console.log("expand accepted");

    if (mainWindow) {
      mainWindow.setSize(width, height, true); // 크기 변경
    }
  });

  ipcMain.on("restore-window", () => {
    if (mainWindow) {
      mainWindow.setSize(1400, 960, true); // 원래 크기로 복원
    }
  });

  // ===================================

  // * CONFIG 조정 *

  ipcMain.handle("get-config", async () => {
    return loadUserConfig();
  });

  // setTimeout(() => {
  //   checkForUpdates();
  // }, 5000);

  // 🔥 업데이트 이벤트 핸들러
  autoUpdater.on("update-available", (info) => {
    log.info("✅ 업데이트 가능: ", info.version);
    dialog
      .showMessageBox({
        type: "info",
        title: "업데이트 확인",
        message: "새로운 업데이트가 있습니다. 다운로드하시겠습니까?",
        buttons: ["업데이트", "나중에"],
      })
      .then((result) => {
        if (result.response === 0) {
          // "업데이트" 선택 시
          startUpdateProcess();
        }
      });
  });

  autoUpdater.on("download-progress", (progress) => {
    log.info(`📥 다운로드 진행중: ${progress.percent.toFixed(2)}%`);
    if (updateWindow) {
      updateWindow.webContents.send("update-progress", progress.percent);
    }
  });

  autoUpdater.on("update-downloaded", () => {
    log.info("✅ 업데이트 다운로드 완료! 앱을 재시작합니다.");
    if (updateWindow) {
      updateWindow.webContents.send("update-complete");
    }
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 3000);
  });

  autoUpdater.on("update-not-available", () => {
    log.info("❌ 업데이트 없음. 최신 버전입니다.");
  });

  autoUpdater.on("error", (error) => {
    log.error("❌ 업데이트 오류 발생:", error);
  });
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

// =========================================================
// =========================================================
// =========================================================

const checkForUpdates = () => {
  log.info("🔄 업데이트 확인 중 (Mac 환경)");
  try {
    log.info("🚀 `autoUpdater.checkForUpdatesAndNotify()` 실행 시도!");

    autoUpdater.setFeedURL({
      provider: "generic",
      url: "https://github.com/sjsylee/leeson_desktop/releases/latest/download/",
    });

    autoUpdater.checkForUpdatesAndNotify();
  } catch (error) {
    log.error("❌ `autoUpdater.checkForUpdatesAndNotify()` 실행 실패:", error);
  }
};

// 업데이트 진행 UI 띄우기
const startUpdateProcess = () => {
  if (mainWindow) {
    mainWindow.close();
  }

  updateWindow = new BrowserWindow({
    width: 400,
    height: 250,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  updateWindow.loadURL("http://localhost:4444/update"); // 업데이트 진행 UI 페이지
  autoUpdater.downloadUpdate();
};

// 설정 파일 로드 함수
const loadUserConfig = () => {
  // 환경 구분 (개발 vs 프로덕션)
  const isDev1 = process.env.NODE_ENV === "development";

  // 설정 파일 경로 설정 (개발과 프로덕션 환경 구분)
  const configPath = isDev1
    ? path.join(__dirname, "../config.json") // 개발 환경에서는 프로젝트 내부에서 관리
    : path.join(app.getPath("userData"), "config.json"); // 프로덕션 환경에서는 사용자 디렉토리에 저장

  console.log(configPath);

  // 기본 설정값 (최초 실행 시 자동 생성)
  const defaultConfig = {
    USER: null,
    PASSWORD: null,
    HOST_IN: null,
    HOST_OUT: null,
    PORT: null,
    DATABASE: null,
  };
  try {
    if (!fs.existsSync(configPath)) {
      console.log("🔄 설정 파일 없음, 기본 설정 생성...");
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    }
    console.log(configPath);

    const configData = fs.readFileSync(configPath, "utf-8");
    const userConfig = JSON.parse(configData);

    console.log("✅ 사용자 설정 로드 완료:", userConfig);
    return userConfig;
  } catch (error) {
    console.error("❌ 사용자 설정 로드 실패:", error);
  }
};
