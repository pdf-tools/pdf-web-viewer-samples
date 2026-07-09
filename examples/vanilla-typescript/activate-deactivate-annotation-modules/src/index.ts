import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

const DEREGISTERED_PLUGINS = [
  "edit-free-text-annotation-plugin",
  "edit-stamp-annotation-plugin",
  "edit-line-annotation-plugin",
  "edit-shape-annotation-plugin",
  "edit-image-annotation-plugin",
  "edit-ink-annotation-plugin",
  "edit-text-markup-annotation-plugin",
  "edit-widget-annotation-plugin",
  "edit-redaction-annotation-plugin",
  "free-text-annotation-plugin",
  "stamp-annotation-plugin",
  "line-annotation-plugin",
  "shape-annotation-plugin",
  "image-annotation-plugin",
  "ink-annotation-plugin",
  "text-markup-annotation-plugin",
  "redaction-annotation-plugin"
];

async function init() {
  const container = document.getElementById('viewer-container')!;
  const viewer = new PdfToolsViewer();

  // Deregister plugins after document is opened (plugins are registered when document loads)
  viewer.addEventListener('PdfTools.document.opened', () => {
    for (const pluginId of DEREGISTERED_PLUGINS) {
      viewer.plugins.deregister(pluginId);
    }
  });

  await viewer.initialize({}, container);

  // Hide components after initialize (DOM elements exist only after initialization)
  viewer.hideComponents([
    'highlight-text-button',
    'stamp-button',
    'line-button',
    'shape-button',
    'image-button',
    'ink-button',
    'redaction-button',
    'text-button'
  ]);
}

init();
