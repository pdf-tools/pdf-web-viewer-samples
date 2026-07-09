import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

async function init() {
  const container = document.getElementById('viewer-container')!;
  const viewer = new PdfToolsViewer();
  await viewer.initialize({}, container);

  viewer.overrideButtonBehavior('open-document-button', 'click', () => {
    viewer.document.download('example.pdf', {
      shouldApplyRedactions: true,
    });
  });

  viewer.overrideButtonBehavior('save-button', 'click', () => {
    viewer.document.open({
      // @NOTE: The 'uri' property should be replaced with the actual URL of the document you want to open.
      'uri': 'url-to-document.pdf',
    });
  });


}

init();
