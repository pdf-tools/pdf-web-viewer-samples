import { PdfFitMode, PdfPageLayoutMode, SearchOptions } from "@pdf-tools/four-heights-pdf-web-viewer";

/**
  * Custom toolbar example showcases implementation of custom toolbar for PDF Web Viewer.
  * Implementation is done in Vanilla TypeScript.
  * Feel free to use it as an example, but implementation can be done by using any library or framework (React, Angular, Vue...).
  * 
  * CustomToolbarState tracks internal component state.
  * CustomToolbarDOM contains interactive HTMLElements that are part of CustomToolbar.
  * CustomToolbarCallbacks are used to invoke PDF Web Viewer methods when user interacts with Custom Toolbar.
  * CustomToolbarOptions are used to customize CustomToolbar behaviour.
 */

interface CustomToolbarState {
  informationPaneOpened: boolean;
  pageNumber: number;
  pageCount: number;
  searchOptionsOpened: boolean;
  isSearchCaseSensitive: boolean;
  isSearchWrappingEnabled: boolean;
  isSearchRegex: boolean;
  fitMode: PdfFitMode;
  rotation: number;
  layoutDropdownOpened: boolean;
  layoutDropdownValue: PdfPageLayoutMode;
  zoomDropdownOpened: boolean;
  zoomDropdownValue: number;
  searchToolbarOpened: boolean;
  zoomToolbarOpened: boolean;
  layoutToolbarOpened: boolean;
}
  
const initialState: CustomToolbarState = {
  informationPaneOpened: false,
  pageNumber: 1,
  pageCount: 1,
  searchOptionsOpened: false,
  isSearchCaseSensitive: false,
  isSearchWrappingEnabled: false,
  isSearchRegex: false,
  layoutDropdownOpened: false,
  fitMode: PdfFitMode.NONE,
  rotation: 0,
  layoutDropdownValue: PdfPageLayoutMode.ONE_COLUMN,
  zoomDropdownOpened: false,
  zoomDropdownValue: 100,
  searchToolbarOpened: false,
  zoomToolbarOpened: false,
  layoutToolbarOpened: false,
};

interface CustomToolbarDOM {
  uploadFileButton: HTMLButtonElement;
  uploadFileInput: HTMLInputElement;
  downloadFileButton: HTMLButtonElement;
  toggleInformationPaneButton: HTMLButtonElement;
  pageNumberInput: HTMLInputElement;
  pageCount: HTMLSpanElement;
  prevPageButton: HTMLButtonElement;
  nextPageButton: HTMLButtonElement;
  toggleSearchToolbarButton: HTMLButtonElement;
  toggleZoomToolbarButton: HTMLButtonElement;
  toggleLayoutToolbarButton: HTMLButtonElement;
  searchToolbar: HTMLDivElement;
  searchInput: HTMLInputElement;
  prevSearchMatchButton: HTMLButtonElement;
  nextSearchMatchButton: HTMLButtonElement;
  searchOptionsContainer: HTMLDivElement;
  caseSensitiveSearchCheckbox: HTMLInputElement;
  wrapSearchCheckbox: HTMLInputElement;
  regularExpressionSearchCheckbox: HTMLInputElement;
  zoomToolbar: HTMLDivElement;
  zoomInButton: HTMLButtonElement;
  zoomOutButton: HTMLButtonElement;
  zoomDropdown: HTMLDivElement;
  zoomDropdownButton: HTMLDivElement,
  zoomDropdownOptionsContainer: HTMLDivElement,
  layoutToolbar: HTMLDivElement;
  toggleFitButton: HTMLButtonElement;
  rotateViewerButton: HTMLButtonElement;
  layoutDropdown: HTMLDivElement;
  layoutDropdownButton: HTMLDivElement,
  layoutDropdownOptionsContainer: HTMLDivElement,
  layoutDropdownOptions: NodeListOf<HTMLDivElement>,
}

export interface CustomToolbarCallbacks {
  onUploadFile?: (file: File) => void;
  onDownloadFileButtonClicked?: () => void;
  onPageNumberChanged?: (pageNumber: number) => void;
  onToggleInformationPaneButtonClicked?: () => void;
  onToggleSearchClicked?: (active: boolean) => void;
  onSearchParamsChanged?: (searchString: string, searchOptions?: SearchOptions) => void;
  onPrevSearchButtonClicked?: () => void;
  onNextSearchButtonClicked?: () => void;
  onZoomChanged?: (zoom: number) => void;
  onFitModeChanged?: (fitMode: PdfFitMode) => void;
  onRotationChanged?: (rotation: number) => void;
  onLayoutModeChanged?: (layoutMode: PdfPageLayoutMode) => void;
}

export interface CustomToolbarOptions {
  defaultZoomLevels: number[];
}

const defaultOptions = {
  defaultZoomLevels: [ 0.1, 0.15, 0.2, 0.25, 0.35, 0.4, 0.5, 0.65, 0.8, 1, 1.25, 1.50, 2, 2.5, 3, 4 ],
};

export default class CustomToolbar {
  private state: CustomToolbarState;
  private dom: CustomToolbarDOM;
  private callbacks: CustomToolbarCallbacks;
  private options: CustomToolbarOptions;

  constructor(callbacks?: CustomToolbarCallbacks, options?: CustomToolbarOptions) {
    this.state = { ...initialState };
    this.dom = {
      uploadFileButton: document.getElementById('upload-file-button') as HTMLButtonElement,
      uploadFileInput: document.getElementById('upload-file-input') as HTMLInputElement,
      downloadFileButton: document.getElementById('download-file-button') as HTMLButtonElement,
      toggleInformationPaneButton: document.getElementById('toggle-information-pane-button') as HTMLButtonElement,
      pageNumberInput: document.getElementById('page-number-input') as HTMLInputElement,
      pageCount: document.getElementById('page-count') as HTMLSpanElement,
      prevPageButton: document.getElementById('prev-page-button') as HTMLButtonElement,
      nextPageButton: document.getElementById('next-page-button') as HTMLButtonElement,
      toggleSearchToolbarButton: document.getElementById('toggle-search-toolbar-button') as HTMLButtonElement,
      toggleZoomToolbarButton: document.getElementById('toggle-zoom-toolbar-button') as HTMLButtonElement,
      toggleLayoutToolbarButton: document.getElementById('toggle-layout-toolbar-button') as HTMLButtonElement,
      searchToolbar: document.getElementById('search-toolbar') as HTMLDivElement,
      searchInput: document.getElementById('search-input') as HTMLInputElement,
      prevSearchMatchButton: document.getElementById('prev-search-match-button') as HTMLButtonElement,
      nextSearchMatchButton: document.getElementById('next-search-match-button') as HTMLButtonElement,
      searchOptionsContainer: document.getElementById('search-options') as HTMLDivElement,
      caseSensitiveSearchCheckbox: document.getElementById('case-sensitive-search-checkbox') as HTMLInputElement,
      wrapSearchCheckbox: document.getElementById('wrap-search-checkbox') as HTMLInputElement,
      regularExpressionSearchCheckbox: document.getElementById('regular-expression-search-checkbox') as HTMLInputElement,
      zoomToolbar: document.getElementById('zoom-toolbar') as HTMLDivElement,
      zoomInButton: document.getElementById('zoom-in-button') as HTMLButtonElement,
      zoomOutButton: document.getElementById('zoom-out-button') as HTMLButtonElement,
      zoomDropdown: document.getElementById('zoom-dropdown') as HTMLDivElement,
      zoomDropdownButton: document.querySelector('#zoom-dropdown .dropdown-button') as HTMLDivElement,
      zoomDropdownOptionsContainer: document.querySelector('#zoom-dropdown .dropdown-options-container') as HTMLDivElement,
      layoutToolbar: document.getElementById('layout-toolbar') as HTMLDivElement,
      toggleFitButton: document.getElementById('toggle-fit-button') as HTMLButtonElement,
      rotateViewerButton: document.getElementById('rotate-viewer-button') as HTMLButtonElement,
      layoutDropdown: document.getElementById('layout-dropdown') as HTMLDivElement,
      layoutDropdownButton: document.querySelector('#layout-dropdown .dropdown-button') as HTMLDivElement,
      layoutDropdownOptionsContainer: document.querySelector('#layout-dropdown .dropdown-options-container') as HTMLDivElement,
      layoutDropdownOptions: document.querySelectorAll('#layout-dropdown .dropdown-options-container .dropdown-option') as NodeListOf<HTMLDivElement>,
    };
    this.callbacks = { ...callbacks };
    this.options = { ...defaultOptions, ...options };

    this.handleUploadFileButtonClicked = this.handleUploadFileButtonClicked.bind(this);
    this.handleUploadFileInputChanged = this.handleUploadFileInputChanged.bind(this);
    this.handleDownloadFileButtonClicked = this.handleDownloadFileButtonClicked.bind(this);
    this.handlePageNumberInputChanged = this.handlePageNumberInputChanged.bind(this);
    this.handlePrevPageButtonClicked = this.handlePrevPageButtonClicked.bind(this);
    this.handleNextPageButtonClicked = this.handleNextPageButtonClicked.bind(this);
    this.handleToggleInformationPaneButtonClicked = this.handleToggleInformationPaneButtonClicked.bind(this);
    this.handleToggleSearchToolbarButtonClicked = this.handleToggleSearchToolbarButtonClicked.bind(this);
    this.handleToggleZoomToolbarButtonClicked = this.handleToggleZoomToolbarButtonClicked.bind(this);
    this.handleToggleLayoutToolbarButtonClicked = this.handleToggleLayoutToolbarButtonClicked.bind(this);
    this.handleSearchInputInput = this.handleSearchInputInput.bind(this);
    this.handleSearchInputKeypress = this.handleSearchInputKeypress.bind(this);
    this.handlePrevSearchMatchClicked = this.handlePrevSearchMatchClicked.bind(this);
    this.handleNextSearchMatchClicked = this.handleNextSearchMatchClicked.bind(this);
    this.handleCaseSensitiveSearchCheckboxClicked = this.handleCaseSensitiveSearchCheckboxClicked.bind(this);
    this.handleWrapSearchCheckboxClicked = this.handleWrapSearchCheckboxClicked.bind(this);
    this.handleRegularExpressionSearchCheckboxClicked = this.handleRegularExpressionSearchCheckboxClicked.bind(this);
    this.handleZoomInButtonClicked = this.handleZoomInButtonClicked.bind(this);
    this.handleZoomOutButtonClicked = this.handleZoomOutButtonClicked.bind(this);
    this.handleZoomDropdownButtonClicked = this.handleZoomDropdownButtonClicked.bind(this);
    this.handleZoomDropdownOptionClicked = this.handleZoomDropdownOptionClicked.bind(this);
    this.handleToggleFitButtonClicked = this.handleToggleFitButtonClicked.bind(this);
    this.handleRotateViewerButtonClicked = this.handleRotateViewerButtonClicked.bind(this);
    this.handleLayoutDropdownButtonClicked = this.handleLayoutDropdownButtonClicked.bind(this);
    this.handleLayoutDropdownOptionClicked = this.handleLayoutDropdownOptionClicked.bind(this);
    this.handleDropdownOutsideClick = this.handleDropdownOutsideClick.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);

    this.init();
  }

  destroy() {
    this.dom.uploadFileButton.removeEventListener('click', this.handleUploadFileButtonClicked);
    this.dom.uploadFileInput.removeEventListener('change', this.handleUploadFileInputChanged);
    this.dom.uploadFileButton.removeEventListener('click', this.handleUploadFileButtonClicked);
    this.dom.pageNumberInput.removeEventListener('change', this.handlePageNumberInputChanged);
    this.dom.prevPageButton.removeEventListener('click', this.handlePrevPageButtonClicked);
    this.dom.nextPageButton.removeEventListener('click', this.handleNextPageButtonClicked);
    this.dom.toggleInformationPaneButton.removeEventListener('click', this.handleToggleInformationPaneButtonClicked);
    this.dom.toggleSearchToolbarButton.removeEventListener('click', this.handleToggleSearchToolbarButtonClicked);
    this.dom.toggleZoomToolbarButton.removeEventListener('click', this.handleToggleZoomToolbarButtonClicked);
    this.dom.searchInput.removeEventListener('input', this.handleSearchInputInput);
    this.dom.searchInput.removeEventListener('keypress', this.handleSearchInputKeypress);
    this.dom.prevSearchMatchButton.removeEventListener('click', this.handlePrevSearchMatchClicked);
    this.dom.nextSearchMatchButton.removeEventListener('click', this.handleNextSearchMatchClicked);
    this.dom.caseSensitiveSearchCheckbox.removeEventListener('change', this.handleCaseSensitiveSearchCheckboxClicked);
    this.dom.wrapSearchCheckbox.removeEventListener('change', this.handleWrapSearchCheckboxClicked);
    this.dom.regularExpressionSearchCheckbox.removeEventListener('change', this.handleRegularExpressionSearchCheckboxClicked);
    this.dom.zoomInButton.removeEventListener('click', this.handleZoomInButtonClicked);
    this.dom.zoomOutButton.removeEventListener('click', this.handleZoomOutButtonClicked);
    this.dom.toggleFitButton.removeEventListener('click', this.handleToggleFitButtonClicked);
    this.dom.rotateViewerButton.removeEventListener('click', this.handleRotateViewerButtonClicked);
    this.dom.toggleLayoutToolbarButton.removeEventListener('click', this.handleToggleLayoutToolbarButtonClicked);
    window.addEventListener('resize', this.handleWindowResize);
    this.destroyDropdowns();
  }

  setPageNumber(pageNumber: number) {
    this.state.pageNumber = pageNumber;
    this.dom.pageNumberInput.value = pageNumber.toString();
    this.refreshPaginationButtons();
  }

  setPageCount(pageCount: number) {
    this.state.pageCount = pageCount;
    this.dom.pageCount.innerText = pageCount.toString();
    this.refreshPaginationButtons();
  }

  setFitMode(fitMode: PdfFitMode) {
    this.state.fitMode = fitMode;
    this.refreshFitModeIcon();
  }

  setRotation(rotation: number) {
    this.state.rotation = rotation;
  }

  setZoom(zoom: number) {
    this.state.zoomDropdownValue = zoom;

    const dropdownValue = this.dom.zoomDropdown.querySelector('.dropdown-value') as HTMLSpanElement;
    dropdownValue.innerText = `${Math.floor(this.state.zoomDropdownValue * 100)}%`;

    this.refreshZoomButtons();
  }

  private init() {
    this.dom.uploadFileButton.addEventListener('click', this.handleUploadFileButtonClicked);
    this.dom.uploadFileInput.addEventListener('change', this.handleUploadFileInputChanged);
    this.dom.downloadFileButton.addEventListener('click', this.handleDownloadFileButtonClicked);
    this.dom.pageNumberInput.addEventListener('change', this.handlePageNumberInputChanged);
    this.dom.prevPageButton.addEventListener('click', this.handlePrevPageButtonClicked);
    this.dom.nextPageButton.addEventListener('click', this.handleNextPageButtonClicked);
    this.dom.toggleInformationPaneButton.addEventListener('click', this.handleToggleInformationPaneButtonClicked);
    this.dom.toggleSearchToolbarButton.addEventListener('click', this.handleToggleSearchToolbarButtonClicked);
    this.dom.toggleZoomToolbarButton.addEventListener('click', this.handleToggleZoomToolbarButtonClicked);
    this.dom.searchInput.addEventListener('input', this.handleSearchInputInput);
    this.dom.searchInput.addEventListener('keypress', this.handleSearchInputKeypress);
    this.dom.prevSearchMatchButton.addEventListener('click', this.handlePrevSearchMatchClicked);
    this.dom.nextSearchMatchButton.addEventListener('click', this.handleNextSearchMatchClicked);
    this.dom.caseSensitiveSearchCheckbox.addEventListener('change', this.handleCaseSensitiveSearchCheckboxClicked);
    this.dom.wrapSearchCheckbox.addEventListener('change', this.handleWrapSearchCheckboxClicked);
    this.dom.regularExpressionSearchCheckbox.addEventListener('change', this.handleRegularExpressionSearchCheckboxClicked);
    this.dom.zoomInButton.addEventListener('click', this.handleZoomInButtonClicked);
    this.dom.zoomOutButton.addEventListener('click', this.handleZoomOutButtonClicked);
    this.dom.toggleFitButton.addEventListener('click', this.handleToggleFitButtonClicked);
    this.dom.rotateViewerButton.addEventListener('click', this.handleRotateViewerButtonClicked);
    this.dom.toggleLayoutToolbarButton.addEventListener('click', this.handleToggleLayoutToolbarButtonClicked);
    window.addEventListener('resize', this.handleWindowResize);
    this.initDropdowns();
  }

  private initDropdowns() {
    this.dom.zoomDropdownButton.addEventListener('click', this.handleZoomDropdownButtonClicked);

    const dropdownOptions = this.options.defaultZoomLevels.map((zoomLevel) => {
      const dropdownOption = document.createElement('div');
      dropdownOption.classList.add('dropdown-option');
      dropdownOption.setAttribute('data-value', zoomLevel.toString());
      dropdownOption.textContent = `${Math.floor(zoomLevel * 100)}%`;
      this.dom.zoomDropdownButton.nextElementSibling.appendChild(dropdownOption);
      return dropdownOption;
    });

    dropdownOptions.forEach((dropdownOption) => {
      dropdownOption.addEventListener('click', this.handleZoomDropdownOptionClicked);
    });

    this.dom.layoutDropdownButton.addEventListener('click', this.handleLayoutDropdownButtonClicked);

    this.dom.layoutDropdownOptions.forEach((dropdownOption) => {
      dropdownOption.addEventListener('click', this.handleLayoutDropdownOptionClicked);
    });
  
    document.addEventListener('click', this.handleDropdownOutsideClick);
  }

  private destroyDropdowns() {
    this.dom.zoomDropdownButton.removeEventListener('click', this.handleZoomDropdownButtonClicked);

    this.dom.zoomDropdownButton.nextElementSibling.childNodes.forEach((dropdownOption) => {
      dropdownOption.removeEventListener('click', this.handleZoomDropdownOptionClicked);
    });

    this.dom.layoutDropdownButton.removeEventListener('click', this.handleLayoutDropdownButtonClicked);

    this.dom.layoutDropdownOptions.forEach((dropdownOption) => {
      dropdownOption.removeEventListener('click', this.handleLayoutDropdownOptionClicked);
    });
  
    document.removeEventListener('click', this.handleDropdownOutsideClick);
  }

  private handleUploadFileButtonClicked() {
    this.dom.uploadFileInput.click();
  }

  private handleUploadFileInputChanged() {
    const file = this.dom.uploadFileInput.files[0];

    if (file.type !== 'application/pdf') return;

    this.callbacks.onUploadFile(file);

    this.dom.uploadFileInput.value = null;
  }

  private handleDownloadFileButtonClicked() {
    this.callbacks.onDownloadFileButtonClicked?.();
  }

  private handlePageNumberInputChanged() {
    let pageNumber = Math.floor(this.dom.pageNumberInput.valueAsNumber);

    if (isNaN(pageNumber) || pageNumber < 1) pageNumber = 1;
    if (pageNumber > this.state.pageCount) pageNumber = this.state.pageCount;

    this.state.pageNumber = pageNumber;
    this.dom.pageNumberInput.value = pageNumber.toString();
    this.callbacks.onPageNumberChanged?.(this.state.pageNumber);

    this.refreshPaginationButtons();
  }

  private handlePrevPageButtonClicked() {
    if (this.state.pageNumber <= 1) return;
    this.state.pageNumber--;
    this.callbacks.onPageNumberChanged?.(this.state.pageNumber);
  }

  private handleNextPageButtonClicked() {
    if (this.state.pageNumber >= this.state.pageCount) return;
    this.state.pageNumber++;
    this.callbacks.onPageNumberChanged?.(this.state.pageNumber);
  }

  private handleToggleInformationPaneButtonClicked() {
    this.state.informationPaneOpened = !this.state.informationPaneOpened;
    this.dom.toggleInformationPaneButton.classList.toggle('active', this.state.informationPaneOpened);
    this.callbacks.onToggleInformationPaneButtonClicked?.();
  }

  private handleToggleSearchToolbarButtonClicked() {
    this.state.searchToolbarOpened = !this.state.searchToolbarOpened;
    this.state.zoomToolbarOpened = false;
    this.state.layoutToolbarOpened = false;
    this.callbacks.onToggleSearchClicked(this.state.searchToolbarOpened);
    this.dom.searchInput.value = '';
    this.refreshSecondaryToolbars();
  }
  
  private handleToggleZoomToolbarButtonClicked() {
    this.state.searchToolbarOpened = false;
    this.state.zoomToolbarOpened = !this.state.zoomToolbarOpened;
    this.state.layoutToolbarOpened = false;
    this.refreshSecondaryToolbars();
  }
  
  private handleToggleLayoutToolbarButtonClicked() {
    this.state.searchToolbarOpened = false;
    this.state.zoomToolbarOpened = false;
    this.state.layoutToolbarOpened = !this.state.layoutToolbarOpened;
    this.refreshSecondaryToolbars();
  }

  private handleSearchInputInput() {
    this.callbacks.onSearchParamsChanged?.(
      this.dom.searchInput.value,
      { 
        startPage: 1, 
        isCaseSensitive: this.state.isSearchCaseSensitive,
        isWrappingEnabled: this.state.isSearchWrappingEnabled,
        isRegex: this.state.isSearchRegex,
        hideToolbar: true,
      },
    );
  }

  private handleSearchInputKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.callbacks.onNextSearchButtonClicked();
    }
  }

  private handlePrevSearchMatchClicked() {
    this.callbacks.onPrevSearchButtonClicked?.();
  }

  private handleNextSearchMatchClicked() {
    this.callbacks.onNextSearchButtonClicked?.();
  }

  private handleCaseSensitiveSearchCheckboxClicked() {
    this.state.isSearchCaseSensitive = this.dom.caseSensitiveSearchCheckbox.checked;
    this.handleSearchInputInput();
  }

  private handleWrapSearchCheckboxClicked() {
    this.state.isSearchWrappingEnabled = this.dom.wrapSearchCheckbox.checked;
    this.handleSearchInputInput();
  }

  private handleRegularExpressionSearchCheckboxClicked() {
    this.state.isSearchRegex = this.dom.regularExpressionSearchCheckbox.checked;
    this.handleSearchInputInput();
  }

  private handleZoomInButtonClicked() {
    let zoomIndex = 0;
    while (this.state.zoomDropdownValue >= this.options.defaultZoomLevels[zoomIndex]) zoomIndex++;
    this.state.zoomDropdownValue = this.options.defaultZoomLevels[zoomIndex];

    this.callbacks.onZoomChanged?.(this.state.zoomDropdownValue);

    const dropdownValue = this.dom.zoomDropdown.querySelector('.dropdown-value') as HTMLSpanElement;
    dropdownValue.innerText = `${Math.floor(this.state.zoomDropdownValue * 100)}%`;

    this.refreshZoomButtons();
  }

  private handleZoomOutButtonClicked() {
    let zoomIndex = this.options.defaultZoomLevels.length - 1;
    while (this.state.zoomDropdownValue <= this.options.defaultZoomLevels[zoomIndex]) zoomIndex--;
    this.state.zoomDropdownValue = this.options.defaultZoomLevels[zoomIndex];

    this.callbacks.onZoomChanged?.(this.state.zoomDropdownValue);

    const dropdownValue = this.dom.zoomDropdown.querySelector('.dropdown-value') as HTMLSpanElement;
    dropdownValue.innerText = `${Math.floor(this.state.zoomDropdownValue * 100)}%`;

    this.refreshZoomButtons();
  }

  private handleZoomDropdownButtonClicked() {
    this.state.zoomDropdownOpened = !this.state.zoomDropdownOpened;
    this.refreshDropdowns();
  }

  private handleZoomDropdownOptionClicked(event: PointerEvent) {
    const dropdownOption = event.target as HTMLDivElement;
    this.state.zoomDropdownValue = Number(dropdownOption.dataset.value);
    this.state.zoomDropdownOpened = !this.state.zoomDropdownOpened;

    this.callbacks.onZoomChanged?.(this.state.zoomDropdownValue);

    const dropdownValue = this.dom.zoomDropdown.querySelector('.dropdown-value') as HTMLSpanElement;
    dropdownValue.innerText = dropdownOption.innerText;

    this.refreshZoomButtons();
    this.refreshDropdowns();
  }

  private handleToggleFitButtonClicked() {
    switch (this.state.fitMode) {
      case PdfFitMode.NONE: this.state.fitMode = PdfFitMode.FIT_PAGE; break;
      case PdfFitMode.FIT_WIDTH: this.state.fitMode = PdfFitMode.NONE; break;
      case PdfFitMode.FIT_PAGE: this.state.fitMode = PdfFitMode.FIT_WIDTH; break;
    }
    this.callbacks.onFitModeChanged?.(this.state.fitMode);
  }

  private handleRotateViewerButtonClicked() {
    this.state.rotation = (this.state.rotation + 90) % 360;
    this.callbacks.onRotationChanged?.(this.state.rotation);
  }

  private handleLayoutDropdownButtonClicked() {
    this.state.layoutDropdownOpened = !this.state.layoutDropdownOpened;
    this.refreshDropdowns();
  }

  private handleLayoutDropdownOptionClicked(event: PointerEvent) {
    const dropdownOption = event.target as HTMLDivElement;
    this.state.layoutDropdownValue = Number(dropdownOption.dataset.value) as PdfPageLayoutMode;
    this.state.layoutDropdownOpened = !this.state.layoutDropdownOpened;

    this.callbacks.onLayoutModeChanged?.(this.state.layoutDropdownValue);

    const dropdownValue = this.dom.layoutDropdown.querySelector('.dropdown-value') as HTMLSpanElement;
    dropdownValue.innerText = dropdownOption.innerText;

    this.refreshDropdowns();
  }

  private handleDropdownOutsideClick(event: MouseEvent) {
    if (this.state.zoomDropdownOpened && !this.dom.zoomDropdown.contains(event.target as Node)) {
      this.state.zoomDropdownOpened = false;
      this.refreshDropdowns();
    }
    if (this.state.layoutDropdownOpened && !this.dom.layoutDropdown.contains(event.target as Node)) {
      this.state.layoutDropdownOpened = false;
      this.refreshDropdowns();
    }
  }

  private handleWindowResize() {
    this.refreshSecondaryToolbars();
  }

  private refreshZoomButtons() {
    let zoomIndex = 0;
    while (this.state.zoomDropdownValue > this.options.defaultZoomLevels[zoomIndex]) zoomIndex++;
    this.dom.zoomInButton.disabled = zoomIndex >= this.options.defaultZoomLevels.length - 1;
    this.dom.zoomOutButton.disabled = zoomIndex <= 0;
  }

  private refreshPaginationButtons() {
    this.dom.prevPageButton.disabled = this.state.pageNumber <= 1;
    this.dom.nextPageButton.disabled = this.state.pageNumber >= this.state.pageCount;
  }
  
  private refreshFitModeIcon() {
    const icon = this.dom.toggleFitButton.querySelector('span[class^="material-icons"]') as HTMLSpanElement;
    switch (this.state.fitMode) {
      case PdfFitMode.NONE: icon.innerText = 'fullscreen'; break;
      case PdfFitMode.FIT_WIDTH: icon.innerText = 'fit_screen'; break;
      case PdfFitMode.FIT_PAGE: icon.innerText = 'zoom_out_map'; break;
    }
  }

  private refreshSecondaryToolbars() {
    this.dom.toggleSearchToolbarButton.classList.toggle('active', this.state.searchToolbarOpened);
    this.dom.toggleZoomToolbarButton.classList.toggle('active', this.state.zoomToolbarOpened);
    this.dom.toggleLayoutToolbarButton.classList.toggle('active', this.state.layoutToolbarOpened);

    this.dom.zoomToolbar.style.top = this.state.zoomToolbarOpened ? `${this.dom.zoomToolbar.parentElement.clientHeight}px` : null;
    this.dom.layoutToolbar.style.top = this.state.layoutToolbarOpened ? `${this.dom.layoutToolbar.parentElement.clientHeight}px` : null;
    this.dom.searchToolbar.style.top = this.state.searchToolbarOpened ? `${this.dom.searchToolbar.parentElement.clientHeight}px` : null;
  }
  
  private refreshDropdowns() {
    this.dom.zoomDropdownOptionsContainer.style.display = this.state.zoomDropdownOpened ? 'flex' : 'none';
    this.dom.layoutDropdownOptionsContainer.style.display = this.state.layoutDropdownOpened ? 'flex' : 'none';
  }
}