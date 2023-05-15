import {
  PdfWebViewer,
  PdfWebViewerOptionsInterface
} from '@pdf-tools/four-heights-pdf-web-viewer';

import './styles.scss';

const viewerElement = document.querySelector<HTMLDivElement>('#pdfviewer');
const license: string = '';
const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    general: {
      user: 'John Doe'
    }
  }
};

const pdfViewer = new PdfWebViewer(viewerElement, license, options);

pdfViewer.addEventListener('appLoaded', () => {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
});

pdfViewer.addEventListener('documentChanged', async () => {
  console.log('Document changed, saving PDF document');
  const pdfData = await pdfViewer.save();

  const res = await fetch('/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/pdf'
    },
    body: pdfData
  });

  if (res.ok) {
    console.log('Document saved');
  } else {
    console.error('Saving document failed');
  }
});
