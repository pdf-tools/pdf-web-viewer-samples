import {
  EraserModule,
  FreetextAnnotationModule,
  HighlightAnnotationModule,
  ImageAnnotationModule,
  InkAnnotationModule,
  PdfWebViewer,
  PdfWebViewerOptionsInterface,
  ShapeAnnotationModule,
  StampAnnotationModule,
  TextAnnotationModule
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
  // Remove unused modules from the list
  modules: [
    TextAnnotationModule,
    InkAnnotationModule,
    EraserModule,
    // FreetextAnnotationModule,
    HighlightAnnotationModule,
    StampAnnotationModule,
    ShapeAnnotationModule,
    ImageAnnotationModule
  ]
};

const pdfViewer = new PdfWebViewer(viewerElement, license, options);

pdfViewer.addEventListener('appLoaded', () => {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
});
