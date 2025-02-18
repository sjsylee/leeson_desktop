"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path_1 = __importStar(require("path"));
// Packages
const electron_1 = require("electron");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const http_1 = require("http");
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const electron_log_1 = __importDefault(require("electron-log"));
const electron_updater_1 = require("electron-updater");
const fs = __importStar(require("fs"));
const nextApp = (0, next_1.default)({ dev: electron_is_dev_1.default, dir: electron_1.app.getAppPath() + "/renderer" });
const handle = nextApp.getRequestHandler();
let mainWindow = null;
let updateWindow = null;
// Prepare the renderer once the app is ready
electron_1.app.on("ready", async () => {
    await nextApp.prepare();
    (0, http_1.createServer)((req, res) => {
        const parsedUrl = (0, url_1.parse)(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(4444, () => {
        console.log("> Ready on http://localhost:4444/home");
    });
    mainWindow = new electron_1.BrowserWindow({
        titleBarStyle: "hidden",
        trafficLightPosition: { x: 15, y: 12 },
        width: 1400,
        height: 960,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false,
            preload: (0, path_1.join)(__dirname, "preload.js"),
        },
    });
    // * 업데이트 확인 *
    checkForUpdates();
    mainWindow.loadURL("http://localhost:4444/home");
    // * 화면 크기 조정 *
    // ✅ 요청을 받으면 창 크기를 확대하는 이벤트 리스너 등록
    electron_1.ipcMain.on("expand-window", (_, { width, height }) => {
        console.log("expand accepted");
        if (mainWindow) {
            mainWindow.setSize(width, height, true); // 크기 변경
        }
    });
    electron_1.ipcMain.on("restore-window", () => {
        if (mainWindow) {
            mainWindow.setSize(1400, 960, true); // 원래 크기로 복원
        }
    });
    // ===================================
    // * CONFIG 조정 *
    electron_1.ipcMain.handle("get-config", async () => {
        return loadUserConfig();
    });
    // setTimeout(() => {
    //   checkForUpdates();
    // }, 5000);
    // 🔥 업데이트 이벤트 핸들러
    electron_updater_1.autoUpdater.on("update-available", (info) => {
        electron_log_1.default.info("✅ 업데이트 가능: ", info.version);
        electron_1.dialog
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
    electron_updater_1.autoUpdater.on("download-progress", (progress) => {
        electron_log_1.default.info(`📥 다운로드 진행중: ${progress.percent.toFixed(2)}%`);
        if (updateWindow) {
            updateWindow.webContents.send("update-progress", progress.percent);
        }
    });
    electron_updater_1.autoUpdater.on("update-downloaded", () => {
        electron_log_1.default.info("✅ 업데이트 다운로드 완료! 앱을 재시작합니다.");
        if (updateWindow) {
            updateWindow.webContents.send("update-complete");
        }
        setTimeout(() => {
            electron_updater_1.autoUpdater.quitAndInstall();
        }, 3000);
    });
    electron_updater_1.autoUpdater.on("update-not-available", () => {
        electron_log_1.default.info("❌ 업데이트 없음. 최신 버전입니다.");
    });
    electron_updater_1.autoUpdater.on("error", (error) => {
        electron_log_1.default.error("❌ 업데이트 오류 발생:", error);
    });
});
// Quit the app once all windows are closed
electron_1.app.on("window-all-closed", electron_1.app.quit);
// =========================================================
// =========================================================
// =========================================================
const checkForUpdates = () => {
    electron_log_1.default.info("🔄 업데이트 확인 중 (Mac 환경)");
    try {
        electron_log_1.default.info("🚀 `autoUpdater.checkForUpdatesAndNotify()` 실행 시도!");
        electron_updater_1.autoUpdater.setFeedURL({
            provider: "generic",
            url: "https://github.com/sjsylee/leeson_desktop/releases/latest/download/",
        });
        electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
    }
    catch (error) {
        electron_log_1.default.error("❌ `autoUpdater.checkForUpdatesAndNotify()` 실행 실패:", error);
    }
};
// 업데이트 진행 UI 띄우기
const startUpdateProcess = () => {
    if (mainWindow) {
        mainWindow.close();
    }
    updateWindow = new electron_1.BrowserWindow({
        width: 400,
        height: 250,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: (0, path_1.join)(__dirname, "preload.js"),
        },
    });
    updateWindow.loadURL("http://localhost:4444/update"); // 업데이트 진행 UI 페이지
    electron_updater_1.autoUpdater.downloadUpdate();
};
// 설정 파일 로드 함수
const loadUserConfig = () => {
    // 환경 구분 (개발 vs 프로덕션)
    const isDev1 = process.env.NODE_ENV === "development";
    // 설정 파일 경로 설정 (개발과 프로덕션 환경 구분)
    const configPath = isDev1
        ? path_1.default.join(__dirname, "../config.json") // 개발 환경에서는 프로젝트 내부에서 관리
        : path_1.default.join(electron_1.app.getPath("userData"), "config.json"); // 프로덕션 환경에서는 사용자 디렉토리에 저장
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
    }
    catch (error) {
        console.error("❌ 사용자 설정 로드 실패:", error);
    }
};
