# Annotation Colors

This is an example that demonstrates customizing annotation color pickers in the PDF Web Viewer.
In the example, we demonstrate the usage of the `ViewerConfig.annotationColors` property and the following method available on the `PdfToolsViewer` interface:

- `setAnnotationColors`: Sets the available colors for annotation color pickers at runtime.

The example includes three color palettes (Corporate, Vibrant, Pastel) that customize colors for:

- `default`: Default colors used by all annotation types unless overridden.
- `inkAnnotation`: Colors for ink/freehand annotations.
- `noteAnnotation`: Colors for sticky note annotations.
- `textMarkupAnnotation`: Colors for text highlight, underline, and strikethrough annotations.
