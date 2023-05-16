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
  pdfViewer.open({ uri: '/form_fields.pdf' }, null, null, null, {
    formFieldHighlightColor: '#DDE4FF',
    formFieldRequiredHighlightColor: '#DCE2F4'
  });
});
