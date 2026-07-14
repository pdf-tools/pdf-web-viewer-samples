# PDF Web Viewer Integration in React Native

## Overview

React Native doesn't support WebAssembly natively. The solution is to serve the PDF Web Viewer via a **local HTTP server** running inside the app, then load it in a WebView.

```bash
┌─────────────────────────────────────────┐
│           React Native App              │
│                                         │
│  ┌─────────────┐    ┌────────────────┐  │
│  │ Local HTTP  │───►│    WebView     │  │
│  │   Server    │    │ localhost:PORT │  │
│  └──────┬──────┘    └────────────────┘  │
│         │                               │
│  ┌──────┴──────────────────────────┐    │
│  │     Bundled Assets (in APK)     │    │
│  │  index.html, JS, WASM, Workers  │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## How It Works

1. **On app start**: Assets are prepared for serving. On Android, they are extracted from APK to document directory. On iOS, they are resolved directly from bundle.
2. **Local server starts**: Serves files on `http://127.0.0.1:<random-port>`.
3. **WebView loads**: Points to the local server URL.
4. **Error handling**: WebView reports initialization errors to React Native via `postMessage`.

## Offline Capability

Fully offline. All viewer files are bundled in the app binary. No internet connection required after installation.

## Platform Notes

| Concern | iOS | Android |
| --------- | ----- | --------- |
| Asset access | Direct from bundle | Extracted to filesystem first |
| Cleartext HTTP | Allowed by default | Requires `usesCleartextTraffic: true` |
| Native build | Required | Required |
| Expo Go | Not supported | Not supported |

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up `assets/pdf-viewer/`

This folder contains all the files needed to run the PDF viewer in the WebView.

#### Folder Structure

```bash
assets/pdf-viewer/
├── index.html                    # Entry point (custom, loads the viewer)
├── pdftools-web-viewer.min.js    # UMD bundle (from dist/umd/)
├── PdfViewingSdkApi_Main.js      # WASM loader
├── PdfViewingSdkApi_Main.wasm    # Main WASM module
├── PdfViewingSdkApi_Worker.js    # Web Worker script
├── PdfViewingSdkApi_Worker.wasm  # Worker WASM module
├── PdfViewing.data               # SDK data file
├── de.json                       # German localization (optional)
├── WebViewer_v5_demo.pdf         # If use `inputDocument` initialization param, copy PDF file (optional)
└── LICENSE.OFL                   # Font license
```

#### Required App Icon Assets

The following image assets must exist in `assets/` for the app to build. These are referenced in `app.json` and used for app icons and splash screens. You must provide your own:

- `assets/icon.png` - Main app icon
- `assets/adaptive-icon.png` - Android adaptive icon foreground
- `assets/splash-icon.png` - Splash screen icon
- `assets/favicon.png` - Web favicon

#### Copy Files from npm Package

```bash
# From your RN project root
mkdir -p assets/pdf-viewer

# Copy from npm package
cp node_modules/@pdftools/pdf-web-viewer/umd/pdftools-web-viewer.min.js assets/pdf-viewer/
cp node_modules/@pdftools/pdf-web-viewer/pdftools-web-viewer/* assets/pdf-viewer/
```

| Source Path | Copy To |
| ------------- | --------- |
| `dist/umd/pdftools-web-viewer.min.js` | `assets/pdf-viewer/` |
| `dist/pdftools-web-viewer/*` (all files) | `assets/pdf-viewer/` |

#### Create `index.html` inside `assets/pdf-viewer`

Entry point that initializes the PDF viewer.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>PDF Web Viewer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    #viewer-container { width: 100%; height: 100%; }
    .error { color: #d32f2f; padding: 20px; text-align: center; }
  </style>
</head>
<body>
  <div id="viewer-container"></div>
  <!-- @pdftools/pdf-web-viewer UMD bundle - provides PdfToolsWebViewer global -->
  <script src="./pdftools-web-viewer.min.js"></script>
  <script>
    (async function() {
      const containerEl = document.getElementById('viewer-container');
      try {
        const viewer = new PdfToolsWebViewer.PdfToolsViewer();
        await viewer.initialize({
          path: './', // Path to WASM files (same directory)
          // @NOTE: If using `inputDocument`, make sure there is a PDF within assets/pdf-viewer.
          inputDocument: { uri: './WebViewer_v5_demo.pdf' } // Optionally, if you want to open a file immediatelly
        }, containerEl);
      } catch (error) {
        containerEl.innerHTML = `<div class="error">Failed to load viewer: ${error.message}</div>`;
        // Send error to React Native app via WebView bridge
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            message: error.message
          }));
        }
      }
    })();
  </script>
</body>
</html>
```

### 3. Configure Platforms

Make sure the `app.json` includes the following configuration:

```json
{
  "expo": {
    "android": {
      "usesCleartextTraffic": true
    },
    "plugins": [
      "./plugins/withPdfViewerAssets"
    ]
  }
}
```

The config plugin (`plugins/withPdfViewerAssets.js`) automatically handles both platforms:

- **Android**: Injects `sourceSets` config into `build.gradle` to include assets in the APK.
- **iOS**: Copies assets and adds folder reference to the Xcode project.

### 4. Generate Native Projects

```bash
npm run prebuild
```

> **Note**: This app requires native builds. It will **not** work with Expo Go.

### 5. Run the App

```bash
# Android
npm run android

# iOS
npm run ios
```

## Key Files

| File | Purpose |
| ------ | --------- |
| `assets/pdf-viewer/` | Bundled viewer files (HTML, JS, WASM) |
| `plugins/withPdfViewerAssets.js` | Config plugin for including assets in builds |
| `hooks/usePdfViewerServer.js` | Manages local server lifecycle ([docs](hooks/README.md)) |
| `App.js` | WebView pointing to local server |
