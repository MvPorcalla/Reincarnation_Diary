# 👨‍💻 Electron Setup Documentation for Reincarnation Diary

## ✨ Purpose

This guide explains how to convert the **Reincarnation Diary** web-based game into a standalone desktop application using **Electron**.

---

## ✅ Prerequisites

* **Node.js** must be installed.

  * [Download Node.js](https://nodejs.org/)

* Basic understanding of terminal/command line.

---

## 🛠️ Step 1: Initialize Node.js Project

```bash
npm init -y
```

This creates a `package.json` file in your project directory.

---

## 🛠️ Step 2: Install Electron

```bash
npm install electron --save-dev
```

This will install Electron locally in your project.

---

## 🗂️ Step 3: Project Structure (Electron Version)

```text
Reincarnation_Diary
├── main.js              # Electron entry point
├── package.json         # Node/Electron project configuration
├── (your existing files and folders)
```

---

## 🔧 Step 4: Create `main.js`

```js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

---

## 📑 Step 5: Configure `package.json`

```json
{
  "name": "reincarnation_diary",
  "version": "1.0.0",
  "description": "A story-driven game built with HTML, CSS, and JS.",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "devDependencies": {
    "electron": "^YOUR_VERSION"
  }
}
```

---

## ▶️ Step 6: Run the Electron App

```bash
npm start
```

Your game will launch as a **desktop app**.

---

## 📦 Step 7 (Optional): Package the App

Install Electron Packager:

```bash
npm install --save-dev electron-packager
```

Build the app:

```bash
npx electron-packager . ReincarnationDiary --platform=win32 --arch=x64 --out=dist
```

This will create a **standalone desktop folder** for Windows.

---

## 💡 Notes

* You can customize the window size, app icons, and even add splash screens.
* For creating installable `.exe` files, you can explore **electron-builder** later.

---

## 🔗 Useful Resources

* Electron Docs: [https://www.electronjs.org/docs](https://www.electronjs.org/docs)
* Electron Packager: [https://github.com/electron/electron-packager](https://github.com/electron/electron-packager)
* Electron Builder: [https://www.electron.build/](https://www.electron.build/)

---
