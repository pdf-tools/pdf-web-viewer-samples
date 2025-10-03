import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

async function init() {
  const container = document.getElementById('viewer-container');
  const viewer = new PdfToolsViewer();
  await viewer.initialize({}, container);
}

init();
