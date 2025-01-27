import {
  PdfWebViewer,
  PdfWebViewerOptionsInterface
} from '@pdf-tools/four-heights-pdf-web-viewer';

import './styles.scss';

const viewerElement = document.querySelector<HTMLDivElement>('#pdfviewer');
const license: string =
  '<4H,V4,VIEWSDK,4GA2AGK1HMH730DE11H8K6EB3GPDQWHTP3H3NW3WTALP1F843NF0V0WQ2QW2MPHAS6>';
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

  setInterval(async () => {
    await pdfViewer.close();
    pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
  }, 500);
});
