import { PdfWebViewer } from '@pdf-tools/four-heights-pdf-web-viewer'

import './styles.scss'

const viewerElement = document.getElementById('pdfviewer')
const license = ''
const options = {
  viewer: {
    general: {
      user: 'John Doe'
    }
  }
}

const pdfViewer = new PdfWebViewer(viewerElement, license, options)

pdfViewer.addEventListener('appLoaded', function () {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' })
})
