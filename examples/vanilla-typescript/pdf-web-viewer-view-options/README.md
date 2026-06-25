# Web Viewer view options

This is an example that demonstrates the basic usage of the PDF Web Viewer, configured with
the following view options:

- `zoomLevels` set to [0.5, 1, 1.5, 1.75]
- `devicePixelRatio` set to 1.5 to decrease quality and improve performance

Once the document is opened, we are setting the following view options:

- `fitMode` set to `FitMode.FitWidth` by using the `documentView.setFitMode` method
- `pageLayoutMode` set to `PageLayoutMode.TwoColumnLeft` by using `documentView.setPageMode` method
