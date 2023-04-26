import { PdfWebViewer, PdfWebViewerOptionsInterface } from '@pdf-tools/four-heights-pdf-web-viewer'
import 'material-icons/iconfont/material-icons.css';
import './styles.scss'
import CustomToolbar from './custom-toolbar';

const viewerElement = document.getElementById('pdfviewer')
const license = ''
const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    general: {
      user: 'John Doe',
      disableMainToolbar: false,
      disableAnnotationToolbar: true,
    },
  },
}

const pdfViewer = new PdfWebViewer(viewerElement, license, options)

pdfViewer.addEventListener('appLoaded', function () {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' })
})

const customToolbar = new CustomToolbar(
  {
    onToggleInformationPaneButtonClicked(visible: boolean) {
      visible ? pdfViewer.showInformationPane() : pdfViewer.hideInformationPane();
    },
  }
);