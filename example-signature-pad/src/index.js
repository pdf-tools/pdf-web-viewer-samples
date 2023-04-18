import { PdfWebViewer } from '@pdf-tools/four-heights-pdf-web-viewer'
import SignaturePad from 'signature_pad'

import { cropImage } from './cropImage'
import './styles.css'

const viewerElement = document.getElementById('pdfviewer')
const license = ''
const options = {
  viewer: {
    general: {
      user: 'John Doe'
    },
    customButtons: {
      annotationbar: [
        {
          text: 'Add Signature',
          icon: '/images/signature.svg',
          onClick: openSignaturePad
        }
      ]
    }
  }
}

const pdfViewer = new PdfWebViewer(viewerElement, license, options)

pdfViewer.addEventListener('appLoaded', function () {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' })
})

// signature pad

const signaturePadPopup = document.getElementById('signaturePadPopup')
const signatureCanvas = document.getElementById('signatureCanvas')
const btnClearSignature = document.getElementById('btnClearSignature')
const btnCancelAddSignature = document.getElementById('btnCancelAddSignature')
const btnAddSignature = document.getElementById('btnAddSignature')

btnClearSignature.addEventListener('click', clearSignaturePad)
btnCancelAddSignature.addEventListener('click', closeSignaturePad)
btnAddSignature.addEventListener('click', addSignature)

const signaturePad = new SignaturePad(signatureCanvas, {})

function addSignature() {
  const imageAnnotationModule = pdfViewer.viewerCanvas.modules.find(
    (m) => m.name === 'ImageAnnotationModule'
  )
  if (imageAnnotationModule) {
    // The added image has the same size of the canvas of the signature pad.
    // You can use the cropImage function to automatically crop the image
    // to the size of the signature
    const image = signatureCanvas.toDataURL('png')
    // const image = cropImage(signatureCanvas)

    imageAnnotationModule.createImage(image)
    clearSignaturePad()
    closeSignaturePad()
  }
}

function clearSignaturePad() {
  signaturePad.clear()
}

function openSignaturePad() {
  signaturePadPopup.classList.add('open')
}

function closeSignaturePad() {
  signaturePadPopup.classList.remove('open')
}
