# Permission options

This example demonstrates how to hide/show search and page layout mode in PDF Web Viewer SDK version 5.

## Version 4 to version 5 migration

In version 5, the following permission options have been replaced with `hideComponents` and `showComponents` methods:

| V4 Option | V5 Hide | V5 Show |
| ----------- | ----------- | ----------- |
| `permissions.enableSearch` | `viewer.hideComponents(['search-button', 'search-panel'])` | `viewer.showComponents(['search-button', 'search-panel'])` |
| `permissions.enablePageLayoutMode` | `viewer.hideComponents(['page-mode-dropdown'])` | `viewer.showComponents(['page-mode-dropdown'])` |

This allows toggling component visibility dynamically at runtime.
