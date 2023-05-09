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
      user: 'John Doe',
      pageShadow: {
        shadowBlur: 4,
        shadowColor: 'rgba(90,90,90,0.2)',
        shadowOffsetX: 0,
        shadowOffsetY: 0
      },
      currentPageShadow: {
        shadowBlur: 4,
        shadowColor: 'rgba(0,99,149,0.6)',
        shadowOffsetX: 0,
        shadowOffsetY: 0
      }
    }
  }
};

const pdfViewer = new PdfWebViewer(viewerElement, license, options);

pdfViewer.addEventListener('appLoaded', () => {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
});
