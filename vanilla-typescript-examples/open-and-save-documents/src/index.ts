import {
  PdfWebViewer,
  PdfWebViewerOptionsInterface
} from '@pdf-tools/four-heights-pdf-web-viewer';
import './styles.scss';

const viewerElement = document.querySelector<HTMLDivElement>('#pdfviewer');
const license: string = '';
const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    permissions: {
      allowFileDrop: false
    },
    callbacks: {
      onOpenFileButtonClicked: handleOpenDocument,
      onSaveFileButtonClicked: handleSaveDocument
    }
  }
};

const pdfViewer = new PdfWebViewer(viewerElement, license, options);

pdfViewer.addEventListener('appLoaded', () => {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
});

async function handleOpenDocument() {
  const res = await fetch('/PdfWebViewer.pdf');

  if (res.ok) {
    const blobData = await res.blob();
    pdfViewer.open({ data: blobData });
  } else {
    console.error('open document failed');
  }
}

async function handleSaveDocument() {
  const pdfData = await pdfViewer.save();

  const res = await fetch('/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/pdf'
    },
    body: pdfData
  });

  if (res.ok) {
    console.log('document saved');
  } else {
    console.error('save document failed');
  }
}
