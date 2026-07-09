import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

async function init() {
  const container = document.getElementById('viewer-container')!;
  const viewer = new PdfToolsViewer();
  await viewer.initialize({}, container);

  viewer.addEventListener('PdfTools.document.changed', async () => {
    const savedDocument = await viewer.document.save();
    console.log('Document saved:', savedDocument);
    // @TODO: Do something with the saved document, e.g. send it to a server or store it locally.
  });
}

init();
