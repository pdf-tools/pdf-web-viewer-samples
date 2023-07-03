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
    },
    permissions: {
      // Disable open file button
      allowOpenFile: false,
      // Disable opening files by using drag & drop
      allowFileDrop: false,
      // Disable save file button
      allowSaveFile: false
    },
    customButtons: {
      documentbar: [
        {
          text: 'Download PDF',
          icon: '/images/download.svg',
          onClick: function () {
            console.log('Download PDF button clicked');
          }
        },
        {
          text: 'Send as Email',
          icon: '/images/envelope.svg',
          onClick: function () {
            console.log('Send as Email button clicked');
          }
        }
      ],
      informationbar: [
        {
          text: 'Close document',
          icon: '/images/times.svg',
          onClick: () => {
            console.log('Close button clicked');
          }
        }
      ],
      annotationbar: [
        {
          text: 'Add QR-Code',
          icon: '/images/qrcode.svg',
          onClick: () => {
            console.log('QR-Code button clicked');
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
