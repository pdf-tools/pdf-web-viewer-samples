export const cropImage = (canvas) => {
  // First duplicate the canvas to not alter the original
  var croppedCanvas = document.createElement('canvas'),
    croppedCtx = croppedCanvas.getContext('2d')

  croppedCanvas.width = canvas.width
  croppedCanvas.height = canvas.height
  croppedCtx.drawImage(canvas, 0, 0)

  // Next do the actual cropping
  var w = croppedCanvas.width,
    h = croppedCanvas.height,
    pix = { x: [], y: [] },
    imageData = croppedCtx.getImageData(
      0,
      0,
      croppedCanvas.width,
      croppedCanvas.height
    ),
    x,
    y,
    index

  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4
      if (imageData.data[index + 3] > 0) {
        pix.x.push(x)
        pix.y.push(y)
      }
    }
  }
  pix.x.sort(function (a, b) {
    return a - b
  })
  pix.y.sort(function (a, b) {
    return a - b
  })
  var n = pix.x.length - 1

  w = pix.x[n] - pix.x[0]
  h = pix.y[n] - pix.y[0]
  var cut = croppedCtx.getImageData(pix.x[0], pix.y[0], w, h)

  croppedCanvas.width = w
  croppedCanvas.height = h
  croppedCtx.putImageData(cut, 0, 0)

  return croppedCanvas.toDataURL('png')
}
