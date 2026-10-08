import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

async function init() {
  const container = document.getElementById('viewer-container')!;
  const viewer = new PdfToolsViewer();
  await viewer.initialize({
    theme: 'custom-shadow',
    customThemes: {
       'custom-shadow': {
           shadow: {
               page: '0 4px 20px rgba(255, 0, 0, 0.6)', // red shadow for all pages
               currentPage: '0 8px 30px rgba(0, 0, 255, 0.8)', // blue shadow for the current page
           },
       },
    }
  }, container);
}

init();
