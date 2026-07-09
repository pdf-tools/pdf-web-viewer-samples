# Autosave

This is an example that demonstrates the basic usage of the PDF Web Viewer, with the autosave functionality.
To implement the autosave functionality, you just have to listen for `PdfTools.document.changed` event and call the `viewer.document.save` method each time the event occurs.
