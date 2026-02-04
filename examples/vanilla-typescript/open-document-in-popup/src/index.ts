import {
  PdfWebViewer,
  PdfWebViewerOptionsInterface
} from '@pdftools/four-heights-pdf-web-viewer';

import './styles.scss';

const popupElement = document.querySelector<HTMLDivElement>('#popup');
const documentLinks = document.querySelectorAll<HTMLAnchorElement>('.document-link');

documentLinks.forEach((documentLink) => {
  documentLink.addEventListener('click', (event) => {
    event.preventDefault();
    openPopup(documentLink.href);
  });
});

function openPopup(pdfUrl: string) {
  const closePopup = () => {
    pdfViewer.destroy();
    popupElement.classList.remove('open');
  };

  const license: string = '';
  const options: Partial<PdfWebViewerOptionsInterface> = {
    viewer: {
      general: {
        user: 'John Doe'
      },
      permissions: {
        allowFileDrop: false,
        allowOpenFile: false
      },
      customButtons: {
        informationbar: [
          {
            text: 'Close document',
            icon: 'images/close.svg',
            onClick: closePopup
          }
        ]
      }
    }
  };

  const pdfViewer = new PdfWebViewer(popupElement, license, options);

  pdfViewer.addEventListener('appLoaded', () => {
    pdfViewer.open({ uri: pdfUrl });
  });

  popupElement.classList.add('open');
}
