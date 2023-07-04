import {
  PdfFitMode,
  PdfPageLayoutMode,
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
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' }, null, null, {
    // initialPageNumber: 5,
    // initialZoom: 0.5,

    // Available PdfFitModes:
    // PdfFitMode.FIT_PAGE
    // PdfFitMode.FIT_PAGE
    // PdfFitMode.NONE
    initialFitMode: PdfFitMode.FIT_WIDTH,

    // Available PdfPageLayoutModes:
    // SINGLE_PAGE
    // ONE_COLUMN
    // TWO_COLUMN_LEFT
    // TWO_COLUMN_RIGHT
    // TWO_PAGE_LEFT
    // TWO_PAGE_RIGHT
    initialPageLayoutMode: PdfPageLayoutMode.TWO_COLUMN_LEFT
  });
});
