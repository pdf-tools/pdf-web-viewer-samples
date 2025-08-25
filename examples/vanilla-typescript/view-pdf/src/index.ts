import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

async function init() {
  const pdfWebViewer = await PdfToolsViewer.initialize();
  const container = document.getElementById('viewer-container');
  container.append(pdfWebViewer);
}

init();
