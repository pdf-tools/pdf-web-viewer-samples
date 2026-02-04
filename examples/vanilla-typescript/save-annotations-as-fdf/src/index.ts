import {
  AnnotationFilterCallback,
  FileType,
  PdfItemType,
  PdfWebViewer,
  PdfWebViewerOptionsInterface
} from '@pdftools/four-heights-pdf-web-viewer';

import './styles.scss';

const timeOpened = new Date();
const user = 'John Doe';

const viewerElement = document.querySelector<HTMLDivElement>('#pdfviewer');
const license: string = '';
const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    general: {
      user: user
    },
    callbacks: {
      onSaveFileButtonClicked: handleSaveDocument
    }
  }
};

const pdfViewer = new PdfWebViewer(viewerElement, license, options);

pdfViewer.addEventListener('appLoaded', () => {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
});

// Annotation filter examples
const annotationFilters: Record<string, AnnotationFilterCallback> = {
  // Save only sticky note annotations
  stickyNotes: (annotation) => annotation.itemType === PdfItemType.TEXT,

  // Save all annotations from the current user
  currentUser: (annotation) => annotation.author === user,

  // Save only modified annotation
  modifiedAnnotations: (annotation) =>
    annotation.creationDate &&
    annotation.creationDate < timeOpened &&
    annotation.modificationDate &&
    annotation.modificationDate > timeOpened,

  // Save only new annotations
  newAnnotations: (annotation) =>
    annotation.creationDate && annotation.creationDate > timeOpened,

  // Save new and modified annotation
  newAndModifiedAnnotations: (annotation) =>
    annotation.modificationDate && annotation.modificationDate > timeOpened
};

async function handleSaveDocument() {
  const fdfData = await pdfViewer.save({
    fileType: FileType.Fdf,
    // Optionally provide annotation filter
    annotationFilter: annotationFilters.stickyNotes
  });

  pdfViewer.open({ uri: '/PdfWebViewer.pdf' }, [{ data: fdfData }]);
}
