import {
  PdfWebViewer,
  PdfWebViewerOptionsInterface
} from '@pdf-tools/four-heights-pdf-web-viewer';

import './scss/styles.scss';

const viewerElement = document.querySelector<HTMLDivElement>('#pdfviewer');
const license: string = '';
const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    general: {
      user: 'John Doe'
    },
    customButtons: {
      documentbar: [
        {
          text: 'Switch theme',
          icon: '/images/light.svg',
          onClick: () => {
            if (document.body.getAttribute('data-theme') === 'light') {
              document.body.setAttribute('data-theme', 'dark');
            } else {
              document.body.setAttribute('data-theme', 'light');
            }
          }
        }
      ]
    }
  }
};

const pdfViewer = new PdfWebViewer(viewerElement, license, options);

pdfViewer.addEventListener('appLoaded', () => {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
});
