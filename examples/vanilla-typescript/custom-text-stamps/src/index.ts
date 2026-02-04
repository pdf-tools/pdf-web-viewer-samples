import {
  PdfWebViewer,
  PdfWebViewerOptionsInterface,
  StampAnnotationColor
} from '@pdftools/four-heights-pdf-web-viewer';

import './styles.scss';

const viewerElement = document.querySelector<HTMLDivElement>('#pdfviewer');
const license: string = '';
const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    general: {
      user: 'John Doe'
    }
  },
  annotation: {
    stamps: [
      {
        text: 'CUSTOM TEXT STAMP',
        color: StampAnnotationColor.GREEN
      }
    ]
  }
};

const pdfViewer = new PdfWebViewer(viewerElement, license, options);

pdfViewer.addEventListener('appLoaded', () => {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
});
