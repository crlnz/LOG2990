/*tslint:disable*/
import { TestBed } from '@angular/core/testing';

import { PaintBucketService } from './paint-bucket.service';
import { ColorService } from '../color/color.service';
import { ActiveToolService } from '../active-tool/active-tool.service';
import { DrawingService } from '../drawing/drawing.service';
import { Renderer2, Component, ElementRef, RendererFactory2 } from '@angular/core';
import { SelectionService } from '../selection/selection.service';
import { PixelData, Coord } from './paint-bucket-properties';

@Component({
  template: `<SVG></SVG>`,
})
class MockSVGComponent {
  nativeElement = document.createElement('svg');
  getAttribute(param: string) {
    return 'string';
  }
  getBoundingClientRect() {
    return true;
  }
}
class MockSVGElement {
}
class MockSVGGraphicsElement {
}
class MockRendererFactory {
  createRenderer(renderer: any, element: any) {
    return new MockRenderer();
  }
}
class MockRenderer {
  addClass(document: string, cssClass: string): boolean {
    return true;
  }
  appendChild(parent: any, child: any) {
    return;
  }
  removeChild(elementRef: any, child: any) {
    return true;
  }
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  createElement(element: any, element2: any) {
    return true;
  }
}
describe('PaintBucketService', () => {
  let service: PaintBucketService;
  let renderer: Renderer2;
  let rendererFactory: RendererFactory2;
  const colorA: PixelData = { r: 255, g: 200, b: 0, a: 0 };
  const colorB: PixelData = { r: 240, g: 201, b: 0, a: 0 };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SVGElement, useClass: MockSVGElement }, { provide: ElementRef, useClass: MockSVGComponent }, SelectionService, { provide: SVGGraphicsElement, useClass: MockSVGGraphicsElement }, { provide: ElementRef, useClass: MockSVGComponent },
      { provide: Renderer2, useClass: MockRenderer }, { provide: RendererFactory2, useClass: MockRendererFactory }, ColorService, DrawingService, ActiveToolService],
    });
    service = TestBed.get(PaintBucketService);
  });

  it('should be created', () => {
    const service: PaintBucketService = TestBed.get(PaintBucketService);
    expect(service).toBeTruthy();
  });

  it('should initialisation', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const map: Map<string, number> = new Map<string, number>();
    service.initialisation(rendererFactory, elementRef);
    expect(service['properties'].pixelVisited).toEqual([]);
    expect(service['properties'].drawingPixels).toEqual([]);
    expect(service['properties'].outlinePixels).toEqual(map);
    expect(service['properties'].renderer).toEqual(rendererFactory.createRenderer(null, null));
  });

  it('should setToolbarWidth', () => {
    const width: number = 1;
    service.setToolbarWidth(width);
    expect(service['properties'].toolbarWidth).toEqual(width);
  });

  it('should call mouseDown ', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    const image: HTMLImageElement = new Image();
    service['properties'].svg = TestBed.get(ElementRef).nativeElement;

    const url = "data:image/svg+xml;base64," + btoa(new XMLSerializer().serializeToString(service['properties'].svg as Node));
    image.src = url;
    spyOn<any>(service, 'createCanvas');
    spyOn<any>(service, 'findValidPixels');
    spyOn<any>(service, 'findOutlinePixels');
    spyOn<any>(service, 'findPathSegments');
    spyOn<any>(service, 'createObjectToAppend');
    service.mouseDown(event);
    expect(service['properties'].pathString).toEqual('');
    expect(service['properties'].svgImage).toEqual(image);
  });
  it('should setDrawingPixelsArray ', () => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D = (canvas.getContext('2d') as CanvasRenderingContext2D);
    const test = ctx.createImageData(1, 1);
    service['properties'].pixelVisited = [];
    service['properties'].drawingPixels = [];
    for (let i = 0; i < test.data.length; i += 4) {
      test.data[i + 0] = 255;
      test.data[i + 1] = 0;
      test.data[i + 2] = 0;
      test.data[i + 3] = 255;
    }
    ctx.putImageData(test, 10, 10);

    service['setDrawingPixelsArray'](test);
    expect(service['properties'].drawingPixels).toEqual([[{ r: 255, g: 0, b: 0, a: 255 }]]);
  });

  it('should initializePixelsVisitedArray by creating a 2D array with the given dimension and initialize values to NULL', () => {
    service['properties'].pixelVisited = [];
    service['initializePixelsVisitedArray'](2, 2);
    expect(service['properties'].pixelVisited).toEqual([[null, null], [null, null]]);
  });


  it('should return true if colorB is in tolerance range of A', () => {
    service.tolerance = 10;
    expect(service['verifyColor'](colorA, colorB)).toBeTruthy();
    service.tolerance = 5;
    expect(service['verifyColor'](colorA, colorB)).toBeFalsy();
  });

  it('should return a list of the next pixels to check by finding the surrounding pixels around a center pixel by calling findSurroundingPixels', () => {
    service['properties'].pixelVisited = [[null, null, null], [null, null, null], [null, null, null]];
    service['properties'].drawingSurfaceWidth = 3;
    service['properties'].drawingSurfaceHeight = 3;
    const pointArray: Coord[] = [{ x: 1, y: 0 }, { x: 1, y: 2 }, { x: 0, y: 1 }, { x: 2, y: 1 }];
    expect(service['findSurroundingPixels']({ x: 1, y: 1 })).toEqual(pointArray);
  });


  it('should only return list of pixels within the drawing surface (pixel is valid) by calling findSurroundingPixels', () => {
    service['properties'].pixelVisited = [[null, null, null], [null, null, null], [null, null, null]];
    service['properties'].drawingSurfaceWidth = 3;
    service['properties'].drawingSurfaceHeight = 3;
    const pointArray: Coord[] = [{ x: 0, y: 1 }, { x: 1, y: 0 }];
    expect(service['findSurroundingPixels']({ x: 0, y: 0 })).toEqual(pointArray);
  });

  it('should only return true if pixel is within the borders of the drawing surface', () => {
    service['properties'].drawingSurfaceWidth = 5;
    service['properties'].drawingSurfaceHeight = 5;
    expect(service['pixelIsValid']({ x: -1, y: -1 })).toBeFalsy();
    expect(service['pixelIsValid']({ x: 1, y: 1 })).toBeTruthy();
  });

  it('should find the valid pixels and return an array mapping the surface of the object to fill', () => {
    service['properties'].pixelVisited = [];
    service['properties'].drawingSurfaceWidth = 4;
    service['properties'].drawingSurfaceHeight = 4;
    service['properties'].drawingPixels = [[colorA, colorB, colorB, colorA],
    [colorA, colorA, colorA, colorA],
    [colorA, colorA, colorB, colorB],
    [colorA, colorB, colorB, colorB]];

    service.tolerance = 10;
    service['findValidPixels'](0, 3);
    let expectedSurface: (boolean | null)[][] = [
      [true, true, true, true],
      [true, true, true, true],
      [true, true, true, true],
      [true, true, true, true]];

    expect(service['properties'].pixelVisited).toEqual(expectedSurface);
    service.tolerance = 5;
    service['findValidPixels'](0, 3);
    expectedSurface = [
      [true, false, false, true],
      [true, true, true, true],
      [true, true, false, false],
      [true, false, null, null]];

    expect(service['properties'].pixelVisited).toEqual(expectedSurface);

  });

  it('should validate the pixel if it has been visited and return true if thats the case', () => {
    service['properties'].pixelVisited = [];
    service['properties'].drawingSurfaceWidth = 4;
    service['properties'].drawingSurfaceHeight = 4;
    service['properties'].drawingPixels = [[colorA, colorB, colorB, colorA],
    [colorA, colorA, colorA, colorA],
    [colorA, colorA, colorB, colorB],
    [colorA, colorB, colorB, colorB]];
    const pixelCoord = { x: 1, y: 2 };
    service['findValidPixels'](pixelCoord.x, pixelCoord.y);
    const returnValue = service['isOutline'](pixelCoord.x, pixelCoord.y);
    expect(returnValue).toBe(true);
  });

  it('should set the outline pixels attributes for every pixels in the dimensions range', ()=>{
    service['properties'].outlinePixels = new Map<string, number>();
    service['properties'].pixelVisited = [];
    service['properties'].drawingSurfaceWidth = 1;
    service['properties'].drawingSurfaceHeight = 1;
    service['properties'].drawingPixels = [[colorA, colorB, colorB, colorA],
    [colorA, colorA, colorA, colorA],
    [colorA, colorA, colorB, colorB],
    [colorA, colorB, colorB, colorB]];
    const pixelCoord = { x: 0, y: 0 };
    service['findValidPixels'](pixelCoord.x, pixelCoord.y);
    service['findOutlinePixels']();
    expect(service['properties'].outlinePixels.has('0,0')).toBe(true);
  });

  it('should find the next pixel according to the current pixel', ()=>{
    service['properties'].previousDirection = 1;
    service['properties'].outlinePixels = new Map<string, number>();
    let current: Coord = {x:1, y:1};
    const test = service['findNextPixel'](current);
    expect(test).toEqual(current);
  });

  it('should construct our outline paths', ()=>{
    service['properties'].outlines = [];
    service['properties'].outlinePixels = new Map<string, number>();
    service['properties'].outlinePixels.set('10,12', 1);
    const spy = spyOn<any>(service, 'deleteKey').and.callThrough();
    service['findPathSegments']();
    expect(service['properties'].outlines.length).toEqual(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should create the object to append and fill the drawing array with this object', ()=>{
    service['properties'].outlines = [];
    service['properties'].renderer = TestBed.get(Renderer2);
    service['drawingService'] = new DrawingService();
    const spy = spyOn<any>(service, 'generatePath').and.callThrough();
    const spy2 = spyOn<any>(service, 'updateAttributes').and.callThrough();
    service['createObjectToAppend']();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(service['drawingService'].drawingArray.length).toBe(1);
  });

  it('should create the path string', ()=>{
    service['properties'].outlines = [];
    service['properties'].pathString = "";
    let current: Coord[] = [{x:1, y:2}];
    service['properties'].outlines.push(current);
    service['generatePath']();
    expect(service['properties'].pathString.length).toBeGreaterThan(1);
  });
});
