import { ElementRef, Renderer2 } from '@angular/core';

export class SelectionProperties {
  toolbarWidth: number;
  amountScrolledX = 0;
  amountScrolledY = 0;

  width: number;
  height: number;
  selectCreated: boolean;

  x1SelectionBox: number;
  y1SelectionBox: number;
  x2SelectionBox: number;
  y2SelectionBox: number;

  topLeft: SVGElement;
  topRight: SVGElement;
  bottomLeft: SVGElement;
  bottomRight: SVGElement;
  topMid: SVGElement;
  bottomMid: SVGElement;
  midLeft: SVGElement;
  midRight: SVGElement;
  selectionBox: SVGGraphicsElement;
  selectedElementsBox: SVGGraphicsElement;
  clipboardElements: SVGElement[] = [];
  elementSvgSelected: SVGAElement;
  copyElement: SVGAElement;

  drawingSurface: SVGElement;
  selectedElements: SVGGraphicsElement[];

  isTranslate: boolean;
  isResizeDiagonal: boolean;
  isResizeHorizontal: boolean;
  isResizeVertical: boolean;
  indexArray: number[] = [];

  renderer: Renderer2;
  svgElement: ElementRef;
}

export enum MagneticPoints {
  TOP_LEFT = 'topLeft',
  TOP_RIGHT = 'topRight',
  TOP_MID = 'topMid',
  CENTER = 'center',
  MID_RIGHT = 'midRight',
  MID_LEFT = 'midLeft',
  BOTTOM_LEFT = 'bottomLeft',
  BOTTOM_RIGHT = 'bottomRight',
  BOTTOM_MID = 'bottomMid',
}
