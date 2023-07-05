# PDF Web Viewer Options

This example showcases most of the available options which can be used to customize the look and behavior of PDF Web Viewer. By using these options, the PDF Web Viewer can be fine-tuned to suit the specific needs of the website or application.

Options used in the example:

- viewer.general.user `string`
  Set the name of the user.

- viewer.general.language `string`
  Set language of the tooltips as a two letter language code.
  Allowed values: ‘en’, ‘de’, ‘fr’, ‘it’ and custom languages

- viewer.general.annotationBarPosition `string`
  Set position of annotation bar.
  Allowed values: ‘top’, ‘left’, ‘right’, ‘bottom’

- viewer.general.promptOnUnsavedChange `boolean`
  If an opened document has unsaved changes and the close or open button is pressed an ’unsaved changes’ dialog appears. This dialog can be suppressed by setting this property to false.

- viewer.general.searchMatchColor `string`
  Background color of highlighted text that is found by using search option.

- viewer.general.textSelectionColor `string`
  Background color of highlighted text that is selected by user.

- viewer.general.rectangularTextSelection `string`
  Rectangular text selection can be turned on with 'automatic' and turned off with 'none'.
  Allowed values: ‘none’, ‘automatic’

- viewer.general.pageLayoutModes `PdfPageLayoutMode`
  Page layout modes.
  Allowed values: SINGLE_PAGE, ONE_COLUMN, TWO_COLUMN_LEFT, TWO_COLUMN_RIGHT, TWO_PAGE_LEFT, TWO_PAGE_RIGHT

- viewer.general.defaultZoomLevels `number[]`
  Default zoom levels that are available to user.

- viewer.general.tooltips `string`
  Tooltips can be turned on with 'title' and turned off with 'none' . If you want use your own CSS stylesheet to configure the tooltips, set 'css’.
  Allowed values: ‘title’, ‘css’, ’none’

- viewer.general.viewOnly `boolean`
  View only viewing mode with disabled editing of annotations and form filling capability. This mode is entered automatically if the license does not support editing. Additionally, it can be enabled or disabled by providing this property.

- viewer.sidebar.thumbnailNavigation `boolean`
  Define if thumbnails are visible in the Information pane.

- viewer.sidebar.outlineNavigation `boolean`
  Define if outlines are visible in the Information pane.

- viewer.sidebar.annotationNavigation.textMarkup.preview `string`
  Define if the preview for text markup annotations is enabled in the Information pane.
  Allowed values: ‘none’, ‘short’

- viewer.permissions.allowOpenFile `boolean`
  Specify if the files can be opened.

- viewer.permissions.allowCloseFile `boolean`
  Specify if the files can be closed.

- viewer.permissions.allowFileDrop `boolean`
  Specify if the files can be opened with drag and drop.

- viewer.permissions.allowPrinting `boolean`
  Specify if the files are allowed to be printed.

- viewer.permissions.allowSaveFile `boolean`
  Specify if the files can be saved.

- viewer.permissions.enableSearch `boolean`
  Specify if a file can be searched through.

- viewer.customButtons.annotationbar `CustomButton[]`
  Specify additional custom buttons which will be added to annotation bar.

- viewer.customButtons.documentbar `CustomButton[]`
  Specify additional custom buttons which will be added to document bar.

- viewer.customButtons.informationbar `CustomButton[]`
  Specify additional custom buttons which will be added to information bar.

- viewer.callbacks.onOpenFileButtonClicked `() => void`
  Override the behaviour of Open File button click event handler.

- viewer.callbacks.onSaveFileButtonClicked `() => void`
  Override the behaviour of Save File button click event handler.

- viewer.callbacks.onCloseFileButtonClicked `() => void`
  Override the behaviour of Close File button click event handler.

- viewer.annotation.colors.highlightColors `string[]`
  Highlight color palette for highlight and sticky note annotations.

- viewer.annotation.colors.backgroundColors `string[]`
  Background color palette for freetext and shape annotations.

- viewer.annotation.colors.foregroundColors `string[]`
  Foreground color palette for freetext, shape and ink annotations.

- viewer.annotation.colors.defaultHighlightColor `string`
  Default foreground color for highlight and sticky note annotations.

- viewer.annotation.colors.defaultBackgroundColor `string`
  Default foreground color for freetext and shape annotations.

- viewer.annotation.colors.defaultForegroundColor `string`
  Default foreground color for freetext, shape and ink annotations.

- viewer.annotation.fonts.fontFamilies `string[]`
  Font families for freetext annotations.

- viewer.annotation.fonts.fontSizes `number[]`
  Font sizes for freetext annotations.

- viewer.annotation.fonts.defaultFontFamily `string`
  Default font family for freetext annotations.

- viewer.annotation.fonts.defaultFontSize `number`
  Default font size for freetext annotations.

- viewer.annotation.highlightOpacity `number`
  Default highlight opacity for highlight annotations.

- viewer.annotation.strokeWidths `number[]`
  Stroke width for ink and shape annotations.

- viewer.annotation.defaultStampWidth `number`
  Set width of the Stamp annotation when it is initially created. The unit of the value is in PDF point.

- viewer.annotation.defaultBorderWidth `number`
  Default width of annotation border.

- viewer.annotation.hideAnnotationSubject `boolean`
  Annotation subject is not visible.

- viewer.annotation.trackHistory `boolean`
  Toggle history tracking for annotation changes.

- viewer.annotation.onlyAuthorCanEdit `boolean`
  Changes to annotations can only be applied when the current user is the author of the annotation at hand.

- viewer.annotation.hideOnDelete `boolean`
  If the value is set to true and if the delete annotation button is pressed for an annotation, it is not deleted, but is flagged as hidden. In this case, the annotation remains visible in the annotation pane.

- viewer.annotation.selectedStamp `number`
  Initially selected stamp for stamp annotations.

- viewer.forms.enabled `boolean`
  Toggle support for filling for fields.

- viewer.modules `CanvasModuleClass[]`
  Enable or disable available annotation modules.
