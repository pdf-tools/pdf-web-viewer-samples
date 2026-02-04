import {
  Annotation,
  PdfItemType,
  PdfWebViewer,
  PdfWebViewerOptionsInterface
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
    annotationPermissionCallback: (annotation: Annotation, author: string) => {
      return annotation.itemType === PdfItemType.UNDERLINE;
    }
  }
};

const pdfViewer = new PdfWebViewer(viewerElement, license, options);

pdfViewer.addEventListener('appLoaded', () => {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
});
