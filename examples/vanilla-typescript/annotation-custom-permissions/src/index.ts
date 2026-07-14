import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

async function init() {
  const container = document.getElementById('viewer-container')!;
  const viewer = new PdfToolsViewer();
  await viewer.initialize({}, container);

  // Hide components after initialize (DOM elements exist only after initialization)
  viewer.hideComponents([
    // In v4, permissions.enableSearch: false removes the search functionality.
    // In v5, we are using the hideComponents API to remove the search functionality.
    'search-button',
    'search-panel',
    // In v4, permissions.enablePageLayoutMode: false removes the page layout mode functionality.
    // In v5, we are using the hideComponents API to remove the page layout mode functionality.
    'page-mode-dropdown',
  ]);
}

init();
