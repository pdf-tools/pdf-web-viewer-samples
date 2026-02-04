import {
  PdfWebViewer,
  PdfWebViewerOptionsInterface
} from '@pdftools/four-heights-pdf-web-viewer';
import './styles.scss';

async function init() {
  const viewerElement = document.querySelector<HTMLDivElement>('#pdfviewer');
  const license: string = '';
  const options: Partial<PdfWebViewerOptionsInterface> = {
    annotation: {
      stamps: [
        {
          name: 'Approved Image',
          image: 'custom-image-stamp.png',
          thumbnail: 'custom-image-stamp-thumbnail.png'
        }
        // Uncomment standard text stamps if you want to use them as well
        // {
        //   translation_key: 'stamptext.approved',
        //   color: 0
        // },
        // {
        //   translation_key: 'stamptext.notApproved',
        //   color: 1
        // },
        // {
        //   translation_key: 'stamptext.draft',
        //   color: 2
        // },
        // {
        //   translation_key: 'stamptext.final',
        //   color: 0
        // },
        // {
        //   translation_key: 'stamptext.completed',
        //   color: 0
        // },
        // {
        //   translation_key: 'stamptext.confidential',
        //   color: 2
        // },
        // {
        //   translation_key: 'stamptext.forPublic',
        //   color: 2
        // },
        // {
        //   translation_key: 'stamptext.notForPublic',
        //   color: 2
        // },
        // {
        //   translation_key: 'stamptext.void',
        //   color: 1
        // },
        // {
        //   translation_key: 'stamptext.forComment',
        //   color: 2
        // },
        // {
        //   translation_key: 'stamptext.preliminaryResults',
        //   color: 2
        // },
        // {
        //   translation_key: 'stamptext.informationOnly',
        //   color: 2
        // }
      ]
    }
  };

  if (options && options.annotation) {
    for (const stamp of options.annotation.stamps) {
      if ('image' in stamp) {
        stamp.image = await fetchBase64(stamp.image, 'image/png');
      }
      if (stamp.thumbnail) {
        stamp.thumbnail = await fetchBase64(stamp.thumbnail, 'image/png');
      }
    }
  }

  const pdfViewer = new PdfWebViewer(viewerElement, license, options);

  pdfViewer.addEventListener('appLoaded', () => {
    pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
  });
}

async function fetchBase64(url: string, mimeType: string) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'data:' + mimeType + ';base64,' + btoa(binary);
}

init();
