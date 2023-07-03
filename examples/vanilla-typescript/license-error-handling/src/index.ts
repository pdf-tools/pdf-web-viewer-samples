import {
  PdfWebViewer,
  PdfWebViewerOptionsInterface
} from '@pdf-tools/four-heights-pdf-web-viewer';

import './styles.scss';

const viewerElement = document.querySelector<HTMLDivElement>('#pdfviewer');
const license: string = 'INVALID_LICENSE_KEY';
const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    general: {
      user: 'John Doe'
    }
  }
};

let pdfViewer = new PdfWebViewer(viewerElement, license, options);

pdfViewer.addEventListener('error', (err) => {
  if (err.message === 'Invalid License') {
    console.error(
      'Invalid License - create new PdfWebViewer with an empty license key'
    );
    pdfViewer.destroy();
    pdfViewer = new PdfWebViewer(viewerElement, '', options);
  }
});
