import { ElementRef, Injectable, RendererFactory2 } from '@angular/core';
import { TraceType } from 'src/app/components/shape-tools/shape-properties';
import { SvgAttributes, SvgTypes } from 'src/app/components/svg-attributes';
import { ActiveToolService } from '../active-tool/active-tool.service';
import { ColorService } from '../color/color.service';
import { DrawingService } from '../drawing/drawing.service';
import { BORDERWIDTH, BOTTOM_RIGHT, CANVAS_CONTEXT, CANVAS_ELEMENT, CANVAS_URL, COMMA, Coord, DEFAULT_STROKE_WIDTH,
  DEFAULT_TOLERANCE, DEFAULT_TRACE_TYPE, EMPTY_STRING, FILL_RULE, FillProperties, INCREMENT, MOVE_DIRECTION, NB_BITS,
  NB_OF_SURROUNDING_PIXELS, NONE, ONE_PIXEL, PERCENTAGE, PIXEL_ONE, PixelData, SPACE,
  X_INDEX, Y_INDEX, ZERO} from './paint-bucket-properties';

@Injectable({
  providedIn: 'root',
})

// https://www.techiedelight.com/flood-fill-algorithm/
// https://codereview.stackexchange.com/questions/202624/flood-fill-using-unordered-map-which-has-user-defined-type-as-key
// https://stackoverflow.com/questions/39615622/how-do-i-make-my-flood-fill-algorithm-more-efficient
export class PaintBucketService implements ActiveToolService {
  tolerance: number = DEFAULT_TOLERANCE;
  strokeWidth: number = DEFAULT_STROKE_WIDTH;
  traceType: string = DEFAULT_TRACE_TYPE;
  private properties: FillProperties = new FillProperties();

  constructor(private colorService: ColorService, private drawingService: DrawingService) {
    this.colorService.currentPrimaryColor.subscribe((fill: string) => this.properties.fillColor = fill);
    this.colorService.currentSecondaryColor.subscribe((outline: string) => this.properties.outlineColor = outline);
  }

  initialisation(rendererFactory: RendererFactory2, anchorSVJ: ElementRef): void {
    this.properties.svg = anchorSVJ.nativeElement;
    this.properties.pixelVisited = [];
    this.properties.drawingPixels = [];

    this.properties.outlinePixels = new Map<string, number>();
    this.properties.renderer = rendererFactory.createRenderer(null, null);
  }

  setToolbarWidth(width: number): void {
    this.properties.toolbarWidth = width;
  }

  mouseDown(event: MouseEvent): void {
    this.properties.pathString = EMPTY_STRING;
    const x =  Math.round(event.clientX - this.properties.svg.getBoundingClientRect().left);
    const y = Math.round(event.clientY - this.properties.svg.getBoundingClientRect().top);

    this.properties.svgImage = new Image();
    const url = CANVAS_URL + btoa(new XMLSerializer().serializeToString(this.properties.svg as Node));
    this.properties.svgImage.src = url;
    this.properties.svgImage.onload = (() => {
      this.createCanvas();
      this.findValidPixels(x, y);
      this.findOutlinePixels();
      this.findPathSegments();
      this.createObjectToAppend();
    });
  }

  mouseMove(event: MouseEvent): void { return; }
  mouseUp(event: MouseEvent): void { return; }
  doubleClick(event: MouseEvent): void { return; }

  private createCanvas(): void {
    const canvas = this.properties.renderer.createElement(CANVAS_ELEMENT);
    canvas.width = this.properties.svg.getBoundingClientRect().width + this.properties.toolbarWidth + BORDERWIDTH;
    canvas.height = this.properties.svg.getBoundingClientRect().height;
    const context = canvas.getContext(CANVAS_CONTEXT) as CanvasRenderingContext2D;
    context.drawImage(this.properties.svgImage, ZERO, ZERO);
    const canvasData = context.getImageData(ZERO, ZERO, canvas.width, canvas.height);
    this.setDrawingPixelsArray(canvasData);
  }

  private initializeDrawingPixelsArray(canvasData: ImageData): void {
    for (let i = ZERO; i < canvasData.width; i++) {
      this.properties.drawingPixels[i] = [];
    }
  }

  private setDrawingPixelsArray(canvasData: ImageData): void {
    this.initializeDrawingPixelsArray(canvasData);
    let x = ZERO;
    let y = ZERO;
    for (let i = ZERO; i < canvasData.data.length; i++) {
      this.properties.drawingPixels[x][y] =  {
        r: canvasData.data[i],
        g: canvasData.data[++i],
        b: canvasData.data[++i],
        a: canvasData.data[++i],
      };
      if (++x >= canvasData.width) {
        y++;
        x = ZERO;
      }
    }
  }

  private findValidPixels(x: number, y: number): void {
    const targetColor: PixelData = this.properties.drawingPixels[x][y];
    this.properties.drawingSurfaceWidth = this.properties.drawingPixels.length;
    this.properties.drawingSurfaceHeight = this.properties.drawingPixels[ZERO].length;
    this.initializePixelsVisitedArray(this.properties.drawingSurfaceWidth, this.properties.drawingSurfaceHeight);
    this.properties.pixelVisited[x][y] = true;

    const pointsToLookAround: Coord[] = [{x, y}];
    while (pointsToLookAround.length) {
      const lastPoint = pointsToLookAround.pop() as Coord;
      const pixelsToCheck = this.findSurroundingPixels(lastPoint);

      for (const pixel of pixelsToCheck) {
        const currentColor = this.properties.drawingPixels[pixel.x][pixel.y];
        const isValid = this.verifyColor(targetColor, currentColor);
        this.properties.pixelVisited[pixel.x][pixel.y] = isValid;

        if (isValid) {
          pointsToLookAround.push(pixel);
        }
      }
    }
  }

  private initializePixelsVisitedArray(width: number, height: number): void {
    for (let x = ZERO; x < width; x++) {
      this.properties.pixelVisited[x] = [];
      for (let y = ZERO; y < height; y++) {
        this.properties.pixelVisited[x][y] = null;
      }
    }
  }

  private pixelIsValid(pixel: Coord): boolean {
    return (pixel.x >= ZERO && pixel.y >= ZERO && pixel.x < this.properties.drawingSurfaceWidth
            && pixel.y < this.properties.drawingSurfaceHeight);
  }

  private findSurroundingPixels(centerPixel: Coord): Coord[] {
    const pixels: Coord[] = [];
    const tempPixels: Coord[] = this.findPixelNeighbors(centerPixel);
    for (const pixel of tempPixels) {
      if (this.pixelIsValid(pixel) && this.properties.pixelVisited[pixel.x][pixel.y] === null) {
        pixels.push(pixel);
      }
    }
    return pixels;
  }

  private verifyColor(colorA: PixelData, colorB: PixelData): boolean {
    const acceptedVar = (NB_BITS * this.tolerance) / PERCENTAGE;
    const redIsValid = (Math.abs(colorA.r - colorB.r) <= acceptedVar);
    const greenIsValid = (Math.abs(colorA.g - colorB.g) <= acceptedVar);
    const blueIsValid = (Math.abs(colorA.b - colorB.b) <= acceptedVar);
    const alphaIsValid = (Math.abs(colorA.a - colorB.a) <= acceptedVar);
    return (redIsValid && greenIsValid && blueIsValid && alphaIsValid);
  }

  private isOutline(x: number, y: number): boolean {
    if (this.properties.pixelVisited[x][y]) {
      const pixelCoord = {x, y};
      const tempPixels: Coord[] = this.findPixelNeighbors(pixelCoord);
      for (const pixel of tempPixels) {
        if (!this.pixelIsValid(pixel) || this.properties.pixelVisited[pixel.x][pixel.y] === null
            || this.properties.pixelVisited[pixel.x][pixel.y] === false) {
          return true;
        }
      }
    }
    return false;
  }

  private findPixelNeighbors(pixel: Coord): Coord[] {
    const x = pixel.x;
    const y = pixel.y;

    const top: Coord = {x, y: y - ONE_PIXEL};
    const bottom: Coord = {x, y: y + ONE_PIXEL};
    const left: Coord = {x: x - ONE_PIXEL, y};
    const right: Coord = {x: x + ONE_PIXEL, y};
    return [top, bottom, left, right];
  }

  private findOutlinePixels(): void {
    for (let x = ZERO; x < this.properties.drawingSurfaceWidth; x++) {
      for (let y = ZERO; y < this.properties.drawingSurfaceHeight; y++) {
        if (this.isOutline(x, y)) {
          const pixelKey = x + COMMA + y;
          this.properties.outlinePixels.set(pixelKey, PIXEL_ONE);
        }
      }
    }
  }

  private nextDirection(direction: number): number {
    return (direction + INCREMENT) % NB_OF_SURROUNDING_PIXELS;
  }

  private findSurroundingCoord(pixel: Coord): Coord[] {
    const pixels: Coord[] = [];
    const x = pixel.x;
    const y = pixel.y;
    pixels.push({x: x - ONE_PIXEL, y: y - ONE_PIXEL});
    pixels.push({x, y: y - ONE_PIXEL });
    pixels.push({x: x + ONE_PIXEL, y: y - ONE_PIXEL});
    pixels.push({x: x + ONE_PIXEL, y});
    pixels.push({x: x + ONE_PIXEL, y: y + ONE_PIXEL});
    pixels.push({x, y: y + ONE_PIXEL});
    pixels.push({x: x - ONE_PIXEL, y: y + ONE_PIXEL});
    pixels.push({x: x - ONE_PIXEL, y});
    return pixels;
  }

  private findNextPixel(currentPixel: Coord): Coord {
    this.properties.previousDirection = (this.properties.previousDirection + MOVE_DIRECTION) % NB_OF_SURROUNDING_PIXELS;
    const coordinatesAround = this.findSurroundingCoord(currentPixel);
    for (let i = ZERO; i < NB_OF_SURROUNDING_PIXELS; i++) {
      const pixelKey = coordinatesAround[this.properties.previousDirection].x + COMMA
                      + coordinatesAround[this.properties.previousDirection].y;
      if (this.properties.outlinePixels.has(pixelKey)) {
        return coordinatesAround[this.properties.previousDirection];
      }
      this.properties.previousDirection = this.nextDirection(this.properties.previousDirection);
    }
    return currentPixel;
  }

  private deleteKey(pixel: Coord): void {
    const key = pixel.x + COMMA + pixel.y;
    this.properties.outlinePixels.delete(key);
  }

  private findPathSegments(): void {
    this.properties.outlines = [];
    while (this.properties.outlinePixels.size) {
      const outline: Coord[] = [];
      this.properties.previousDirection = BOTTOM_RIGHT;

      const coordinates = this.properties.outlinePixels.keys().next().value.split(COMMA);
      const firstPixel = {x: Number(coordinates[X_INDEX]), y: Number(coordinates[Y_INDEX])};

      outline.push(firstPixel);
      let currentPixel = this.findNextPixel(firstPixel);

      while (currentPixel.x !== firstPixel.x || currentPixel.y !== firstPixel.y) {
        outline.push(currentPixel);
        this.deleteKey(currentPixel);
        const nextPixel = this.findNextPixel(currentPixel);
        if (nextPixel.x === currentPixel.x && nextPixel.y === currentPixel.y) {
          break;
        }
        currentPixel = this.findNextPixel(currentPixel);
      }
      this.deleteKey(firstPixel);
      this.properties.outlines.push(outline);
    }
  }

  private generatePath(): void {
    for (const outline of this.properties.outlines) {
      let outlineString = SvgAttributes.M + SPACE + outline[ZERO].x + COMMA + outline[ZERO].y + SPACE;
      for (const pixel of outline) {
        outlineString += SvgAttributes.L + SPACE + pixel.x + COMMA + pixel.y + SPACE;
      }
      outlineString += SvgAttributes.Z + SPACE;
      this.properties.pathString += outlineString;
    }
  }

  private createObjectToAppend(): void {
    const container = this.properties.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);
    const path = this.properties.renderer.createElement(SvgTypes.PATH, SvgTypes.SVG_LINK);
    this.properties.renderer.appendChild(this.properties.svg, container);
    this.properties.renderer.appendChild(container, path);
    this.generatePath();
    this.updateAttributes(path);

    if (container) {
      this.drawingService.fillDrawingArray(container);
    }
  }

  private updateAttributes(path: SVGElement): void {
    this.properties.renderer.setAttribute(path, SvgAttributes.D, this.properties.pathString);
    this.properties.renderer.setAttribute(path, SvgAttributes.STROKE_WIDTH, this.strokeWidth.toString());
    this.properties.renderer.setAttribute(path, SvgAttributes.FILL_RULE, FILL_RULE);

    switch (this.traceType) {
      case TraceType.FILL:
        this.properties.renderer.setAttribute(path, SvgAttributes.FILL, this.properties.fillColor);
        this.properties.renderer.setAttribute(path, SvgAttributes.STROKE, NONE);
        break;

      case TraceType.OUTLINE:
        this.properties.renderer.setAttribute(path, SvgAttributes.FILL, NONE);
        this.properties.renderer.setAttribute(path, SvgAttributes.STROKE, this.properties.outlineColor);
        break;

      case TraceType.FILLOUTLINE:
        this.properties.renderer.setAttribute(path, SvgAttributes.FILL, this.properties.fillColor);
        this.properties.renderer.setAttribute(path, SvgAttributes.STROKE, this.properties.outlineColor);
        break;
    }
  }
}
