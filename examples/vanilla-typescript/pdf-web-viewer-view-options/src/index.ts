import { FitMode, PageLayoutMode, PdfToolsViewer } from '@pdftools/pdf-web-viewer';

async function init() {
  const container = document.getElementById('viewer-container')!;
  const viewer = new PdfToolsViewer();
  await viewer.initialize({
    'zoomLevels': [0.5, 1, 1.5, 1.75],
    'devicePixelRatio': 1.5,
  }, container);

  viewer.addEventListener('PdfTools.document.opened', () => {
    viewer.documentView.setFitMode(FitMode.FitWidth);
    viewer.documentView.setPageMode(PageLayoutMode.TwoColumnLeft);
  });
}

init();
