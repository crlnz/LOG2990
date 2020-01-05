/* tslint:disable */

import { TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { ActiveToolService } from '../active-tool/active-tool.service';
import { DrawingService } from '../drawing/drawing.service';
import { EraserService } from './eraser.service';

class MockRenderer {
  addClass(document: string, cssClass: string): boolean {
    return true;
  }
  appendChild(parent: any , child: any) {
    return ;
  }
  createElement(name: string) {
    if (name === 'a') {
    return document.createElement('a');
    } else {
      return document. createElementNS("http://www.w3.org/2000/svg", "svg");
    }
  }
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  removeChild(parent: any, child: any) {
    return;
  }
}
class MockSVGComponent {
  getAttribute(param: string) {
    return 'string';
  }
}
class MockSVGElement {
  getAttribute(element: any) {
    return true;
  }
  getBBox(){
    return true;
  }
}

class MockSVGAElement {
  getBBox(){
    return true;
  }
}
class MockSVGGraphicsElement{
  getBBox(){
    return document. createElementNS("http://www.w3.org/2000/svg", "svg");
  }
}
class MockRendererFactory {
  createRenderer(renderer: any, element: any) {
    return new MockRenderer();
  }
}
describe('EraserService', () => {
  let service: EraserService;
  let renderer: Renderer2;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingImportsModule],
      providers: [ActiveToolService, EraserService,
        {provide: Renderer2, useClass: MockRenderer}, {provide: SVGAElement, useClass: MockSVGAElement},  
        {provide: ElementRef, useClass: MockSVGComponent}, {provide: SVGElement, useClass: MockSVGElement}, 
        {provide: RendererFactory2, useClass: MockRendererFactory}, {provide: SVGGraphicsElement, useClass:MockSVGGraphicsElement}],
    });
  });
  beforeEach(() => {

  });

  it('should be created', () => {
    const service: EraserService = TestBed.get(EraserService);
    expect(service).toBeTruthy();
  });

  it('should call initialisation', () => {
    const service: EraserService = TestBed.get(EraserService);
    const mockSVGComponent = document.createElement('SVG');
    const mockElementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const drawingServide = new DrawingService();
    service.initialisation(rendererFactory, mockElementRef, drawingServide);
    expect(service['svgElement']).toEqual(mockElementRef);
    expect(service['renderer']).toEqual(rendererFactory.createRenderer(null, null));
  });

  it('should call setAmountScrolled', () => {
    const service: EraserService = TestBed.get(EraserService);
    service.setAmountScrolled(1, 1);
    expect(service['amountScrolledX']).toEqual(1);
    expect(service['amountScrolledY']).toEqual(1);
  });

  it('should call setToolbarWidth', () => {
    const service: EraserService = TestBed.get(EraserService);
    service.setToolbarWidth(1);
    expect(service['toolbarWidth']).toEqual(1);
  });

  /*it('should call mouseDown', () => {
    const service: EraserService = new EraserService();
    service['renderer'] = TestBed.get(Renderer2);
    const event: MouseEvent = new MouseEvent('mousedown');
    service['svgElement'] = TestBed.get(SVGElement);
    service['svgElement'].nativeElement = {} as MockSVGComponent;
    event.target !== service['svgElement'].nativeElement;
    service['drawingService'] = new DrawingService();
    const svg= document. createElementNS("http://www.w3.org/2000/svg", "svg");
    const rect =document. createElementNS("http://www.w3.org/2000/svg", "rect");
    svg.appendChild(rect);
    service['elementSvg'] = rect;
    service['eraser'] = TestBed.get(SVGGraphicsElement);
    spyOn(service, 'mouseDown').and.callThrough();
    spyOn<any>(service, 'removeRedBox').and.callThrough();
    spyOn(service['renderer'], 'removeChild');
    service.mouseDown(event);
    expect(service['mousePressed']).toBe(true);
  });

  it('should call mouseMove', () => {
    const service: EraserService = TestBed.get(EraserService);
    service['renderer'] = TestBed.get(Renderer2);
    const event: MouseEvent = new MouseEvent('mousemove');
    service['svgElement'] = TestBed.get(SVGElement);
    service['svgElement'].nativeElement = {} as MockSVGComponent;
    event.target !== service['svgElement'].nativeElement;
    event.target instanceof SVGElement;
    service['boxCreated'] = true;
    service['mousePressed'] = true;
    service['xInit'] = 1;
    service['xFinal'] = 1;
    service['yInit'] = 1;
    service['yFinal'] = 1;
    service['otherCopy'] = TestBed.get(SVGAElement);
    service['svgElement'] = TestBed.get(SVGElement);
    service['elementSvg'] !== service['svgElement'].nativeElement;
    spyOn<any>(service, 'removeRedBox').and.callThrough();
    spyOn<any>(service, 'createRedBox');
    spyOn<any>(service, 'drawRedBox');
    spyOn(service['renderer'], 'removeChild');
    service['createEraser'];
    service['eraser'] = TestBed.get(SVGGraphicsElement);
    service.mouseMove(event);
    expect(service['xInit']).toEqual(1);
    expect(service['xFinal']).toEqual(1);
    expect(service['yInit']).toEqual(1);
    expect(service['yFinal']).toEqual(1);

  });

  it('should call mouseUp', () => {
    const service: EraserService = TestBed.get(EraserService);
    service['renderer'] = TestBed.get(Renderer2);
    const event: MouseEvent = new MouseEvent('mouseup');
    service['svgElement'] = TestBed.get(SVGElement);
    service['drawingService'] = new DrawingService();
    spyOn(service, 'mouseUp').and.callThrough();
    service.mouseUp(event);
    expect(service['mousePressed']).toBe(false);
  });

  it('should call doubleClick', () => {
    const service: EraserService = TestBed.get(EraserService);
    const event: MouseEvent = new MouseEvent('dblclick');
    const spy = spyOn(service, 'doubleClick');
    service.doubleClick(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call drawRedBox', () => {
    const service: EraserService = TestBed.get(EraserService);
    const svgElement = TestBed.get(SVGElement) as SVGElement;
    service['renderer'] = TestBed.get(Renderer2);
    svgElement.getAttribute('stroke') != 'none';
    const spy = spyOn(service['renderer'], 'setAttribute');
    spyOn(svgElement, 'getAttribute');
    service['drawRedBox'](1, 1, 1, 1, svgElement);
    expect(spy).toHaveBeenCalled();
  });

  it('should call drawRedBox', () => {
    const service: EraserService = TestBed.get(EraserService);
    const svgElement = TestBed.get(SVGElement) as SVGElement;
    svgElement.getAttribute('stroke') == 'none';
    service['renderer'] = TestBed.get(Renderer2);
    const spy = spyOn(service['renderer'], 'setAttribute');
    spyOn(svgElement, 'getAttribute');
    service['drawRedBox'](1, 1, 1, 1, svgElement);
    expect(spy).toHaveBeenCalled();
  });

  it('should call createRedBox', () => {
    const service: EraserService = TestBed.get(EraserService);
    service['renderer'] = TestBed.get(Renderer2);
    service['svgElement'] = TestBed.get(SVGElement);
    service['svgElement'].nativeElement = {} as MockSVGComponent; // TestBed.get(SVGElement);
    const spy = spyOn(service['renderer'], 'appendChild');
    service['createRedBox']();
    expect(service['redBox']).toEqual(service['renderer'].createElement('rect', 'http://www.w3.org/2000/svg'));
    expect(spy).toHaveBeenCalled();
    expect(service['boxCreated']).toBe(true);
  });

  it('should call removeRedBox', () => {
    const service: EraserService = TestBed.get(EraserService);
    service['renderer'] = TestBed.get(Renderer2);
    service['svgElement'] = TestBed.get(SVGElement);
    service['svgElement'].nativeElement = {} as MockSVGComponent; // TestBed.get(SVGElement);
    const spy = spyOn(service['renderer'], 'removeChild');
    service['removeRedBox']();
    expect(spy).toHaveBeenCalled();
    expect(service['boxCreated']).toBe(false);
  });*/

});
