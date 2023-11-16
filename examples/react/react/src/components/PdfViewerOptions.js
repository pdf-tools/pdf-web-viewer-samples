import { useRef, useEffect } from 'react';
import {
  PdfWebViewer,
  PdfPageLayoutMode,
  TextAnnotationModule,
  InkAnnotationModule,
  FreetextAnnotationModule,
  HighlightAnnotationModule,
  StampAnnotationModule,
  PopupModule,
  ShapeAnnotationModule,
  ImageAnnotationModule,
  StampAnnotationColor
} from '@pdf-tools/four-heights-pdf-web-viewer';

import license from '../license';

export default (props) => {
  const viewerContainer = useRef();

  useEffect(() => {
    const options = {
      viewer: {
        general: {
          user: 'John Doe',
          pageLayoutModes: [
            PdfPageLayoutMode.ONE_COLUMN,
            PdfPageLayoutMode.SINGLE_PAGE,
            PdfPageLayoutMode.TWO_COLUMN_LEFT,
            PdfPageLayoutMode.TWO_COLUMN_RIGHT,
            PdfPageLayoutMode.TWO_PAGE_LEFT,
            PdfPageLayoutMode.TWO_PAGE_RIGHT
          ]
        },
        permissions: {
          allowFileDrop: true,
          allowOpenFile: true,
          allowSaveFile: true,
          enableSearch: true,
          allowPrinting: false
        },
        sidebar: {
          annotationNavigation: true,
          outlineNavigation: true,
          thumbnailNavigation: true
        }
      },
      annotation: {
        colors: {
          highlightColors: ['#2ADB1A', '#FFEA02', '#FF7F1F', '#FF2882', '#008AD1'],
          foregroundColors: [
            '#323232',
            '#FFFFFF',
            '#FFEA02',
            '#2ADB1A',
            '#0066CC',
            '#D82F32'
          ],
          backgroundColors: [
            'transparent',
            '#FFFFFF',
            '#FCF5E2',
            '#323232',
            '#FFEA02',
            '#D82F32',
            '#0066CC',
            '#ff000055'
          ],
          defaultHighlightColor: '#FFEA02',
          defaultBackgroundColor: '#FCF5E2',
          defaultForegroundColor: '#323232'
        },
        stamps: [
          { text: 'APPROVED', color: StampAnnotationColor.GREEN },
          { text: 'NOT APPROVED', color: StampAnnotationColor.RED },
          { text: 'DRAFT', color: StampAnnotationColor.BLUE },
          { text: 'FINAL', color: StampAnnotationColor.GREEN },
          { text: 'COMPLETED', color: StampAnnotationColor.GREEN },
          { text: 'CONFIDENTIAL', color: StampAnnotationColor.BLUE },
          { text: 'FOR PUBLIC RELEASE', color: StampAnnotationColor.BLUE },
          { text: 'NOT FOR PUBLIC RELEASE', color: StampAnnotationColor.BLUE },
          { text: 'VOID', color: StampAnnotationColor.RED },
          { text: 'FOR COMMENT', color: StampAnnotationColor.BLUE },
          { text: 'PRELIMINARY RESULTS', color: StampAnnotationColor.BLUE },
          { text: 'INFORMATION ONLY', color: StampAnnotationColor.BLUE }
        ]
      },
      modules: [
        PopupModule,
        TextAnnotationModule,
        InkAnnotationModule,
        FreetextAnnotationModule,
        HighlightAnnotationModule,
        StampAnnotationModule,
        ShapeAnnotationModule,
        ImageAnnotationModule
      ]
    };

    const _viewer = new PdfWebViewer(viewerContainer.current, license, options);

    return () => {
      _viewer.destroy();
    };
  }, []);

  return <div ref={viewerContainer} />;
};
