const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let apiProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: "AnesthPredict 1.0",
    icon: path.join(__dirname, 'public/icon.ico'), // Se não tiver ícone, ele usa o padrão
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Em DEV carrega o Vite (localhost). Em PROD carrega o arquivo estático.
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'dist/index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function startPython() {
  let backendPath;
  if (app.isPackaged) {
    // Modo Produção (Instalado)
    backendPath = path.join(process.resourcesPath, 'backend.exe');
  } else {
    // Modo Desenvolvimento
    backendPath = path.join(__dirname, 'resources', 'backend.exe');
  }

  console.log("Iniciando Backend Python em:", backendPath);
  apiProcess = spawn(backendPath);

  apiProcess.stdout.on('data', (data) => {
    console.log(`[Python]: ${data}`);
  });
}

app.on('ready', () => {
  startPython();
  createWindow();
});

app.on('will-quit', () => {
  if (apiProcess) apiProcess.kill();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});