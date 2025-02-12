import { Pdf, UI, Core } from '@pdftools/pdf-web-sdk';
import {
  calculateFragmentSubQuadrilateral,
  calculateGlyphOffsetIndex,
  calculateSameFragmentGlyphOffsetIndices,
  drawQuadrilateralArea,
  getDistanceBetweenPoints
} from './Util';

/**
 * Interface defining the structure of text selection information.
 */
export interface TextSelectionInfo {
  /**
   * The starting point of the selection in document view coordinates.
   */
  startPoint?: Pdf.Geometry.Point;

  /**
   * The ending point of the selection in document view coordinates.
   */
  endPoint?: Pdf.Geometry.Point;

  /**
   * The page number where the selection starts.
   */
  startPageNumber?: number;

  /**
   * The page number where the selection ends.
   */
  endPageNumber?: number;

  /**
   * Information about the starting text fragment in the selection.
   */
  startFragmentInfo?: TextSelectionFragmentInfo;

  /**
   * Information about the ending text fragment in the selection.
   */
  endFragmentInfo?: TextSelectionFragmentInfo;

  /**
   * An array of text fragments included in the selection.
   */
  selectedFragments?: Pdf.TextFragment[];

  /**
   * The selected text as a string.
   */
  selectedText?: string;
}

/**
 * Interface defining information about a specific text selection fragment.
 */
export interface TextSelectionFragmentInfo {
  /**
   * The text fragment associated with this selection.
   */
  fragment?: Pdf.TextFragment;

  /**
   * The index of the fragment within the page.
   */
  index?: number;

  /**
   * The glyph offset position within the fragment associated with the mouse position. Used for text selection algorithm.
   */
  glyphOffset?: number;

  /**
   * The starting glyph index within the fragment.
   */
  startGlyphOffsetIndex?: number;

  /**
   * The ending glyph index within the fragment.
   */
  endGlyphOffsetIndex?: number;

  /**
   * An array of document view points associated with the fragment. Used for text selection algorithm.
   */
  documentViewPoints?: Pdf.Geometry.Point[];

  /**
   * The index of the nearest document view point. Used for text selection algorithm.
   */
  nearestDocumentViewPointIndex?: number;
}

/**
 * Represents a custom text selection layer using an HTML canvas element.
 * This layer highlights selected text fragments within a PDF document view.
 */
export class CustomTextSelectionLayer extends UI.Layer<HTMLCanvasElement> {
  /**
   * Stores information about the selected text fragments.
   */
  private _textSelectionInfo: TextSelectionInfo = {
    selectedFragments: []
  };
  public get textSelectionInfo(): TextSelectionInfo {
    return this._textSelectionInfo;
  }
  public set textSelectionInfo(v: TextSelectionInfo) {
    this._textSelectionInfo = v;

    this.render();
  }

  /**
   * Stores the quadrilateral coordinates of selected text fragments.
   */
  private _selectedQuadrilaterals: Pdf.Geometry.Quadrilateral[] = [];

  /**
   * Initializes the native canvas element for rendering the selection layer.
   */
  protected initializeNativeElement(): void {
    this._nativeElement = document.createElement('canvas');

    this._nativeElement.style.position = 'absolute';
    this._nativeElement.style.mixBlendMode = 'multiply';
    this._nativeElement.classList.add('text-selection-layer');
  }

  /**
   * Handles changes in layer size and updates the layer dimensions accordingly.
   */
  protected onSizeChange(): void {
    this._nativeElement.width = this._size.width;
    this._nativeElement.height = this._size.height;

    this.render();
  }

  /**
   * Renders the text selection overlay on the canvas by drawing selected quadrilaterals.
   */
  protected render(): void {
    const textSelectionLayerCtx = this.nativeElement.getContext('2d');
    textSelectionLayerCtx.clearRect(0, 0, this.size.width, this.size.height);

    this.calculateSelectedQuadrilaterals();

    this._selectedQuadrilaterals.forEach((quadrilateral) => {
      drawQuadrilateralArea(this._nativeElement, quadrilateral, '#ADD8E6');
    });
  }

  /**
   * Calculates the quadrilaterals corresponding to the selected text fragments
   * for the current page and stores them in `_selectedQuadrilaterals`.
   */
  private calculateSelectedQuadrilaterals() {
    const selectedPageFragments = this._textSelectionInfo.selectedFragments.filter(
      (fragment) => fragment.pageNumber === this._documentViewPage.pageNumber
    );

    this._selectedQuadrilaterals = selectedPageFragments.map((fragment) => {
      const page = this._documentViewPage.documentView.pdfDocument.pages.getByNumber(
        fragment.pageNumber
      );

      let quadrilateral: Pdf.Geometry.Quadrilateral;

      if (fragment === this._textSelectionInfo.startFragmentInfo?.fragment) {
        const fragmentSubQuadrilateral = calculateFragmentSubQuadrilateral(
          fragment,
          this._textSelectionInfo.startFragmentInfo.startGlyphOffsetIndex,
          this._textSelectionInfo.startFragmentInfo.endGlyphOffsetIndex
        );

        quadrilateral = page.calculateDocumentViewPageQuadrilateral(
          fragmentSubQuadrilateral as any,
          this._documentViewPage.size.width,
          this._documentViewPage.size.height,
          Pdf.Rotation.None
        );
      } else if (fragment === this._textSelectionInfo.endFragmentInfo?.fragment) {
        const fragmentSubQuadrilateral = calculateFragmentSubQuadrilateral(
          fragment,
          this._textSelectionInfo.endFragmentInfo.startGlyphOffsetIndex,
          this._textSelectionInfo.endFragmentInfo.endGlyphOffsetIndex
        );

        quadrilateral = page.calculateDocumentViewPageQuadrilateral(
          fragmentSubQuadrilateral as any,
          this._documentViewPage.size.width,
          this._documentViewPage.size.height,
          Pdf.Rotation.None
        );
      } else {
        quadrilateral = page.calculateDocumentViewPageQuadrilateral(
          fragment.quadrilateral as any,
          this._documentViewPage.size.width,
          this._documentViewPage.size.height,
          Pdf.Rotation.None
        );
      }

      return quadrilateral;
    });
  }
}

/**
 * Interface defining event types for changes in custom text selection plugin.
 */
export interface CustomTextSelectionPluginEventMap {
  /**
   * Event triggered when the text selection changes.
   * @param selectedText - The newly selected text.
   */
  textSelectionChanged: (selectedText: string) => void;
}

/**
 * Plugin that handles custom text selection within a document view.
 */
export class CustomTextSelectionPlugin
  extends Core.EventEmitter<CustomTextSelectionPluginEventMap>
  implements UI.Plugin
{
  /**
   * Unique identifier for the plugin.
   */
  id: string = 'custom-text-selection-plugin';

  /**
   * Indicates whether the plugin is active.
   */
  private _active: boolean = false;
  public get active(): boolean {
    return this._active;
  }
  private set active(v: boolean) {
    this._active = v;
  }

  /**
   * Reference to the associated document view.
   */
  private _documentView: UI.DocumentView = null;
  public get documentView(): UI.DocumentView {
    return this._documentView;
  }
  public set documentView(v: UI.DocumentView) {
    this._documentView = v;
    this.___document = this._documentView.pdfDocument;
  }

  private ___document: Pdf.Document = null;
  private _isSelecting: boolean = false;
  private _textSelectionInfo: TextSelectionInfo = {
    selectedFragments: []
  };

  constructor(documentView: UI.DocumentView) {
    super();

    this.documentView = documentView;
  }

  /**
   * Activates the plugin and sets up event listeners.
   */
  activate(): void {
    this._active = true;

    this.addEventListeners();

    this._documentView.slidingWindow.forEach((documentViewPage) => {
      documentViewPage.interactiveLayer = new CustomTextSelectionLayer(
        'custom-text-selection-layer',
        documentViewPage
      );
    });
  }

  /**
   * Deactivates the plugin and removes event listeners.
   */
  deactivate(): void {
    this._active = false;
    this._textSelectionInfo = {
      selectedFragments: []
    };
    this._isSelecting = false;

    this.removeEventListeners();

    this._documentView.slidingWindow.forEach((documentViewPage) => {
      documentViewPage.interactiveLayer = null;
    });
  }

  /**
   * Adds event listeners required for text selection.
   */
  private addEventListeners() {
    this._documentView.addEventListener('pageMouseMove', this.handlePageMouseMove);
    this._documentView.addEventListener(
      'pageAddedToViewport',
      this.handlePageAddedToViewport
    );
    this._documentView.addEventListener('pageMouseDown', this.handlePageMouseDown);
    this._documentView.addEventListener('pageMouseUp', this.handlePageMouseUp);
    this._documentView.addEventListener(
      'pageDoubleClick',
      this.handlePageDoubleClick
    );
    this._documentView.addEventListener('pageMouseEnter', this.handlePageMouseEnter);
  }

  /**
   * Removes previously added event listeners.
   */
  private removeEventListeners() {
    this._documentView.removeEventListener(
      'pageMouseMove',
      this.handlePageMouseMove
    );
    this._documentView.removeEventListener(
      'pageAddedToViewport',
      this.handlePageAddedToViewport
    );
    this._documentView.removeEventListener(
      'pageMouseDown',
      this.handlePageMouseDown
    );
    this._documentView.removeEventListener('pageMouseUp', this.handlePageMouseUp);
    this._documentView.removeEventListener(
      'pageDoubleClick',
      this.handlePageDoubleClick
    );
    this._documentView.removeEventListener(
      'pageMouseEnter',
      this.handlePageMouseEnter
    );
  }

  /**
   * Handles mouse movement over a document page.
   * @param pageNumber - The number of the page where the event occurred.
   * @param e - The mouse event.
   */
  private handlePageMouseMove = (_pageNumber: number, e: MouseEvent) => {
    this._textSelectionInfo.endPoint = new Pdf.Geometry.Point(e.offsetX, e.offsetY);
    this.updateCursor(e);
    if (this._isSelecting) {
      this.updateSelection();
      this.recalculateSelectedText();
    }
  };

  /**
   * Handles when a page is added to the viewport.
   * @param pageNumber - The number of the page added.
   */
  private handlePageAddedToViewport = (pageNumber: number) => {
    const documentViewPage = this._documentView.slidingWindow.get(pageNumber);
    const interactiveLayer = new CustomTextSelectionLayer(
      'custom-text-selection-layer',
      documentViewPage
    );
    documentViewPage.interactiveLayer = interactiveLayer;
    interactiveLayer.textSelectionInfo = this._textSelectionInfo;
  };

  /**
   * Handles mouse down event for text selection.
   * @param pageNumber - The number of the page where the event occurred.
   * @param e - The mouse event.
   */
  private handlePageMouseDown = async (pageNumber: number, e: MouseEvent) => {
    const fragmentInfo = await this.getFragmentInfoBellowPointer(
      pageNumber,
      new Pdf.Geometry.Point(e.offsetX, e.offsetY)
    );

    if (!fragmentInfo) {
      this._textSelectionInfo = {
        selectedFragments: [],
        endPageNumber: this._textSelectionInfo.endPageNumber,
        selectedText: this._textSelectionInfo.selectedText
      };
      this.recalculateSelectedText();
      return;
    }

    this._isSelecting = true;
    this._textSelectionInfo.startPoint = new Pdf.Geometry.Point(
      e.offsetX,
      e.offsetY
    );
    this._textSelectionInfo.startFragmentInfo = fragmentInfo;
    this._textSelectionInfo.startPageNumber = pageNumber;
    this.updateTextSelectionLayers();
  };

  /**
   * Handles mouse up event, finalizing text selection.
   */
  private handlePageMouseUp = () => {
    this._isSelecting = false;
  };

  /**
   * Handles a double-click event for text selection.
   * @param pageNumber - The number of the page where the event occurred.
   * @param e - The mouse event.
   */
  private handlePageDoubleClick = async (pageNumber: number, e: MouseEvent) => {
    this._textSelectionInfo.startFragmentInfo =
      await this.getFragmentInfoBellowPointer(
        pageNumber,
        new Pdf.Geometry.Point(e.offsetX, e.offsetY)
      );

    this._textSelectionInfo.endFragmentInfo = null;
    this._textSelectionInfo.selectedFragments = [];

    if (this._textSelectionInfo.startFragmentInfo) {
      this._textSelectionInfo.selectedFragments = [
        this._textSelectionInfo.startFragmentInfo.fragment
      ];
      this._textSelectionInfo.startFragmentInfo.glyphOffset =
        Number.NEGATIVE_INFINITY;
      this._textSelectionInfo.startFragmentInfo.startGlyphOffsetIndex = 0;
      this._textSelectionInfo.startFragmentInfo.endGlyphOffsetIndex =
        this._textSelectionInfo.startFragmentInfo.fragment.glyphOffsets.length - 2;
    }

    this.recalculateSelectedText();
  };

  /**
   * Handles when the mouse enters a page.
   * @param pageNumber - The number of the page entered.
   */
  private handlePageMouseEnter = (pageNumber: number) => {
    this._textSelectionInfo.endPageNumber = pageNumber;
  };

  /**
   * Updates the selection based on user interaction.
   */
  private async updateSelection(): Promise<void> {
    const fragmentInfoBellowPointer = await this.getFragmentInfoBellowPointer(
      this._textSelectionInfo.endPageNumber,
      this._textSelectionInfo.endPoint
    );

    if (fragmentInfoBellowPointer !== null) {
      this._textSelectionInfo.endFragmentInfo = fragmentInfoBellowPointer;
    } else {
      this._textSelectionInfo.endFragmentInfo = await this.getNeareastFragmentInfo(
        this._textSelectionInfo.endPageNumber,
        this._textSelectionInfo.endPoint
      );
    }

    this._textSelectionInfo.selectedFragments = [];

    if (
      this._textSelectionInfo.startPageNumber ===
      this._textSelectionInfo.endPageNumber
    ) {
      if (
        this._textSelectionInfo.startFragmentInfo.fragment ===
        this._textSelectionInfo.endFragmentInfo.fragment
      ) {
        this._textSelectionInfo.selectedFragments = [
          this._textSelectionInfo.startFragmentInfo.fragment
        ];

        const indexes = calculateSameFragmentGlyphOffsetIndices(
          this._textSelectionInfo.startFragmentInfo.fragment.glyphOffsets,
          Math.min(
            this._textSelectionInfo.startFragmentInfo.glyphOffset,
            this._textSelectionInfo.endFragmentInfo.glyphOffset
          ),
          Math.max(
            this._textSelectionInfo.startFragmentInfo.glyphOffset,
            this._textSelectionInfo.endFragmentInfo.glyphOffset
          )
        );

        this._textSelectionInfo.startFragmentInfo.startGlyphOffsetIndex =
          indexes.startGlyphOffsetIndex;
        this._textSelectionInfo.startFragmentInfo.endGlyphOffsetIndex =
          indexes.endGlyphOffsetIndex;
      } else {
        const page = this.___document.pages.getByNumber(
          this._textSelectionInfo.startPageNumber
        );

        const fragments = await page.loadTextFragments();

        const startFragmentInfoIndex = Math.min(
          this._textSelectionInfo.startFragmentInfo.index,
          this._textSelectionInfo.endFragmentInfo.index
        );

        const endFragmentInfoIndex = Math.max(
          this._textSelectionInfo.startFragmentInfo.index,
          this._textSelectionInfo.endFragmentInfo.index
        );

        this._textSelectionInfo.selectedFragments = fragments.slice(
          startFragmentInfoIndex,
          endFragmentInfoIndex + 1
        );

        const startFragmentInfo =
          this._textSelectionInfo.startFragmentInfo.index === startFragmentInfoIndex
            ? this._textSelectionInfo.startFragmentInfo
            : this._textSelectionInfo.endFragmentInfo;

        const endFragmentInfo =
          this._textSelectionInfo.startFragmentInfo.index === startFragmentInfoIndex
            ? this._textSelectionInfo.endFragmentInfo
            : this._textSelectionInfo.startFragmentInfo;

        startFragmentInfo.startGlyphOffsetIndex = calculateGlyphOffsetIndex(
          startFragmentInfo.fragment.glyphOffsets,
          startFragmentInfo.glyphOffset
        );
        startFragmentInfo.endGlyphOffsetIndex =
          startFragmentInfo.fragment.glyphOffsets.length - 2;

        endFragmentInfo.startGlyphOffsetIndex = 0;
        endFragmentInfo.endGlyphOffsetIndex = calculateGlyphOffsetIndex(
          endFragmentInfo.fragment.glyphOffsets,
          endFragmentInfo.glyphOffset
        );
      }
    } else {
      const startPageNumber = Math.min(
        this._textSelectionInfo.startPageNumber,
        this._textSelectionInfo.endPageNumber
      );
      const endPageNumber = Math.max(
        this._textSelectionInfo.startPageNumber,
        this._textSelectionInfo.endPageNumber
      );

      if (
        !this._textSelectionInfo.startFragmentInfo ||
        !this._textSelectionInfo.endFragmentInfo
      )
        return;

      const startFragmentInfo =
        this._textSelectionInfo.startFragmentInfo.fragment.pageNumber ===
        startPageNumber
          ? this._textSelectionInfo.startFragmentInfo
          : this._textSelectionInfo.endFragmentInfo;

      const endFragmentInfo =
        this._textSelectionInfo.endFragmentInfo.fragment.pageNumber === endPageNumber
          ? this._textSelectionInfo.endFragmentInfo
          : this._textSelectionInfo.startFragmentInfo;

      for (let i = startPageNumber; i < endPageNumber + 1; i++) {
        const page = this.___document.pages.getByNumber(i);

        const fragments = await page.loadTextFragments();

        if (i === startPageNumber) {
          startFragmentInfo.startGlyphOffsetIndex = calculateGlyphOffsetIndex(
            startFragmentInfo.fragment.glyphOffsets,
            startFragmentInfo.glyphOffset
          );
          startFragmentInfo.endGlyphOffsetIndex =
            startFragmentInfo.fragment.glyphOffsets.length - 2;
          for (let i = startFragmentInfo.index; i < fragments.length; i++) {
            this._textSelectionInfo.selectedFragments.push(fragments[i]);
          }
        } else if (i === endPageNumber) {
          for (let i = 0; i <= endFragmentInfo.index; i++) {
            this._textSelectionInfo.selectedFragments.push(fragments[i]);
          }
          endFragmentInfo.startGlyphOffsetIndex = 0;
          endFragmentInfo.endGlyphOffsetIndex = calculateGlyphOffsetIndex(
            endFragmentInfo.fragment.glyphOffsets,
            endFragmentInfo.glyphOffset
          );
        } else {
          this._textSelectionInfo.selectedFragments.push(...fragments);
        }
      }
    }
  }

  /**
   * Retrieves text fragment information at a given pointer location.
   * @param pageNumber - The page number.
   * @param point - The point location within the page.
   */
  private async getFragmentInfoBellowPointer(
    pageNumber: number,
    point: Pdf.Geometry.Point
  ): Promise<TextSelectionFragmentInfo> {
    const page = this.___document.pages.getByNumber(pageNumber);

    const fragments = await page.loadTextFragments();

    const documentViewPage = this._documentView.slidingWindow.get(pageNumber);

    if (!documentViewPage) return null;

    const fragmentIndex = fragments.findIndex((f) => {
      const viewingSdkPointsQuadrilateral = f.quadrilateral as any;

      const quadrilateral = page.calculateDocumentViewPageQuadrilateral(
        viewingSdkPointsQuadrilateral,
        documentViewPage.size.width,
        documentViewPage.size.height,
        0
      );

      return quadrilateral.containsPoint(point);
    });

    if (fragmentIndex === -1) return null;

    const viewingSdkPointsQuadrilateral = fragments[fragmentIndex]
      .quadrilateral as any;

    const quadrilateral = page.calculateDocumentViewPageQuadrilateral(
      viewingSdkPointsQuadrilateral,
      documentViewPage.size.width,
      documentViewPage.size.height,
      0
    );

    const perpendicularIntersectionPoint =
      Pdf.Geometry.Point.calculatePerpendicularIntersection(
        quadrilateral.p1,
        quadrilateral.p2,
        point
      );

    const viewingSdkPerpendicularIntersectionPoint =
      page.calculateViewingSdkPdfCoordinates(
        perpendicularIntersectionPoint as any,
        documentViewPage.size.width,
        documentViewPage.size.height,
        Pdf.Rotation.None
      );

    let glyphOffset = getDistanceBetweenPoints(
      viewingSdkPerpendicularIntersectionPoint,
      viewingSdkPointsQuadrilateral.p1
    );

    const centroidPoint = Pdf.Geometry.Point.calculateCentroid(quadrilateral.points);

    const documentViewPoints = [
      quadrilateral.p1,
      quadrilateral.p2,
      quadrilateral.p3,
      quadrilateral.p4,
      centroidPoint,
      perpendicularIntersectionPoint
    ];

    if (
      perpendicularIntersectionPoint.x === quadrilateral.p1.x &&
      perpendicularIntersectionPoint.y === quadrilateral.p1.y
    ) {
      glyphOffset = Number.NEGATIVE_INFINITY;
    } else if (
      perpendicularIntersectionPoint.x === quadrilateral.p2.x &&
      perpendicularIntersectionPoint.y === quadrilateral.p2.y
    ) {
      glyphOffset = Number.POSITIVE_INFINITY;
    }

    return {
      documentViewPoints: documentViewPoints,
      fragment: fragments[fragmentIndex],
      index: fragmentIndex,
      glyphOffset: glyphOffset
    };
  }

  /**
   * Updates the cursor style based on the selection state.
   * @param e - The mouse event.
   */
  private async updateCursor(e: MouseEvent) {
    const documentViewPage = this._documentView.slidingWindow.get(
      this._textSelectionInfo.endPageNumber
    );

    const fragmentInfoBellowPointer = await this.getFragmentInfoBellowPointer(
      this._textSelectionInfo.endPageNumber,
      new Pdf.Geometry.Point(e.offsetX, e.offsetY)
    );

    documentViewPage.container.style.cursor =
      this._isSelecting || fragmentInfoBellowPointer ? 'text' : '';
  }

  /**
   * Retrieves the nearest text fragment information relative to a point.
   * @param pageNumber - The page number.
   * @param point - The point location within the page.
   */
  private async getNeareastFragmentInfo(
    pageNumber: number,
    point: Pdf.Geometry.Point
  ): Promise<TextSelectionFragmentInfo> {
    const page = this.___document.pages.getByNumber(pageNumber);

    const fragments = await page.loadTextFragments();

    let nearestFragmentIndex = -1;
    let nearestFragmentDistance = Number.POSITIVE_INFINITY;
    let nearestFragmentDocumentViewPoints: Pdf.Geometry.Point[] = [];
    let nearestDocumentViewPointIndex = -1;
    let nearestGlyphOffset = -1;

    for (let i = 0; i < fragments.length; i++) {
      const viewingSdkPointsQuadrilateral = fragments[i].quadrilateral as any;

      const documentViewPage = this._documentView.slidingWindow.get(pageNumber);

      const quadrilateral = page.calculateDocumentViewPageQuadrilateral(
        viewingSdkPointsQuadrilateral,
        documentViewPage.size.width,
        documentViewPage.size.height,
        0
      );

      const centroidPoint = Pdf.Geometry.Point.calculateCentroid(
        quadrilateral.points
      );

      const perpendicularIntersectionPoint =
        Pdf.Geometry.Point.calculatePerpendicularIntersection(
          quadrilateral.p1,
          quadrilateral.p2,
          point
        );

      const points = [
        quadrilateral.p1,
        quadrilateral.p2,
        quadrilateral.p3,
        quadrilateral.p4,
        centroidPoint,
        perpendicularIntersectionPoint
      ];

      let minimumDistance = Number.POSITIVE_INFINITY;
      let nearestIndex = -1;

      for (let i = 0; i < points.length; i++) {
        const distance = getDistanceBetweenPoints(points[i], point);
        if (distance < minimumDistance) {
          minimumDistance = distance;
          nearestIndex = i;
        }
      }

      if (minimumDistance < nearestFragmentDistance) {
        nearestFragmentIndex = i;
        nearestFragmentDistance = minimumDistance;
        nearestFragmentDocumentViewPoints = [
          quadrilateral.p1,
          quadrilateral.p2,
          quadrilateral.p3,
          quadrilateral.p4,
          centroidPoint,
          perpendicularIntersectionPoint
        ];
        nearestDocumentViewPointIndex = nearestIndex;

        const viewingSdkPerpendicularIntersectionPoint =
          page.calculateViewingSdkPdfCoordinates(
            perpendicularIntersectionPoint as any,
            documentViewPage.size.width,
            documentViewPage.size.height,
            Pdf.Rotation.None
          );

        nearestGlyphOffset = getDistanceBetweenPoints(
          viewingSdkPerpendicularIntersectionPoint,
          viewingSdkPointsQuadrilateral.p1
        );

        if (
          perpendicularIntersectionPoint.x === quadrilateral.p1.x &&
          perpendicularIntersectionPoint.y === quadrilateral.p1.y
        ) {
          nearestGlyphOffset = Number.NEGATIVE_INFINITY;
        } else if (
          perpendicularIntersectionPoint.x === quadrilateral.p2.x &&
          perpendicularIntersectionPoint.y === quadrilateral.p2.y
        ) {
          nearestGlyphOffset = Number.POSITIVE_INFINITY;
        }
      }
    }

    if (nearestFragmentIndex === -1) {
      return null;
    }

    return {
      fragment: fragments[nearestFragmentIndex],
      index: nearestFragmentIndex,
      glyphOffset: nearestGlyphOffset,
      documentViewPoints: nearestFragmentDocumentViewPoints,
      nearestDocumentViewPointIndex: nearestDocumentViewPointIndex
    };
  }

  /**
   * Recalculates the selected text based on the selected fragments.
   */
  private recalculateSelectedText() {
    let selectedText = '';

    for (let i = 0; i < this._textSelectionInfo.selectedFragments.length; i++) {
      const fragment = this._textSelectionInfo.selectedFragments[i];

      if (
        fragment === this._textSelectionInfo.startFragmentInfo?.fragment ||
        fragment === this._textSelectionInfo.endFragmentInfo?.fragment
      ) {
        const fragmentInfo =
          fragment === this._textSelectionInfo.startFragmentInfo.fragment
            ? this._textSelectionInfo.startFragmentInfo
            : this._textSelectionInfo.endFragmentInfo;

        selectedText += ' ';
        selectedText += fragmentInfo.fragment.text.slice(
          fragmentInfo.startGlyphOffsetIndex,
          fragmentInfo.endGlyphOffsetIndex + 1
        );
      } else {
        selectedText += ' ';
        selectedText += fragment.text;
      }
    }

    selectedText = selectedText.trim();

    const previousSelectedText = this._textSelectionInfo.selectedText;

    this._textSelectionInfo.selectedText = selectedText;

    if (previousSelectedText !== this._textSelectionInfo.selectedText) {
      this.dispatchEvent('textSelectionChanged', [
        this._textSelectionInfo.selectedText
      ]);
    }

    this.updateTextSelectionLayers();
  }

  /**
   * Updates the text selection layers with the current selection.
   */
  private updateTextSelectionLayers() {
    this._documentView.slidingWindow.forEach((documentViewPage) => {
      const interactiveLayer =
        documentViewPage.interactiveLayer as CustomTextSelectionLayer;

      interactiveLayer.textSelectionInfo = this._textSelectionInfo;
    });
  }
}
