import { Renderer2 } from '@angular/core';
import { TraceType } from 'src/app/components/shape-tools/shape-properties';

export class FillProperties {
  toolbarWidth: number;
  drawingSurfaceWidth: number;
  drawingSurfaceHeight: number;
  svgImage: HTMLImageElement;
  pixelVisited: (boolean|null)[][] ;
  outlinePixels: Map<string, number>;
  outlines: Coord[][];
  previousDirection: number;
  drawingPixels: PixelData[][] = [];
  renderer: Renderer2;
  svg: SVGElement;
  fillColor: string;
  outlineColor: string;
  pathString: string ;

}

export interface Coord {
  x: number;
  y: number;
}

export interface PixelData {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface PixelSurroundings {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export const BOTTOM_RIGHT = 4;
export const CANVAS_CONTEXT = '2d';
export const CANVAS_ELEMENT = 'canvas';
export const BORDERWIDTH = 5;
export const DEFAULT_TOLERANCE = 0;
export const FILL_RULE = 'evenodd';
export const COMMA = ',';
export const SPACE = ' ';
export const EMPTY_STRING = '';
export const DEFAULT_STROKE_WIDTH = 2;
export const DEFAULT_TRACE_TYPE = TraceType.FILLOUTLINE;
export const NONE = 'none';
export const CANVAS_URL = 'data:image/svg+xml;base64,';
export const X_INDEX = 0;
export const Y_INDEX = 1;
export const NB_OF_SURROUNDING_PIXELS = 8;
export const ONE_PIXEL = 1;
export const ZERO = 0;
export const INCREMENT = 1;
export const NB_BITS = 255;
export const PERCENTAGE = 100;
export const PIXEL_ONE = 1;
export const PIXEL_TWO = 2;
export const MOVE_DIRECTION = 6;
