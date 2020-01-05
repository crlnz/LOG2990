/* tslint:disable */
import { TestBed } from '@angular/core/testing';
import { Component, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { ClipboardService } from './clipboard.service';
import { DrawingService } from '../drawing/drawing.service';
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
class MockSVGAElement {
  getAttributes(param: string){
    return true;
  }
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
  insertBefore(element: any, element2: any) {
    return true;
  }
  createElementNS(element: any, element2: any) {
    return document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  }
}
describe('ClipboardService', () => {
  let service: ClipboardService;
  let renderer: Renderer2;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClipboardService, { provide: ElementRef, useClass: MockSVGComponent }, { provide: SVGElement, useClass: MockSVGElement },
        { provide: Renderer2, useClass: MockRenderer }, { provide: RendererFactory2, useClass: MockRendererFactory },{ provide: SVGAElement, useClass: MockSVGAElement }],
    });
    service = TestBed.get(ClipboardService);
  });

  it('should be created', () => {
    const service: ClipboardService = TestBed.get(ClipboardService);
    expect(service).toBeTruthy();
  });

  it('should call the initialisation method and return the correct values', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, drawingService);
    expect(service['svgElement']).toEqual(elementRef);
    expect(service['renderer']).toEqual(rendererFactory.createRenderer(null, null));
  });

  it('should call the copy method and set the correct values', () => {
    service['svgElement'] = TestBed.get(ElementRef);
    service['drawingSurface'] = service['svgElement'].nativeElement as SVGElement;
    const selectedElementsArray: Node[] = [];
    let test: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    selectedElementsArray.push(test as Node);
    service['clipBoardArray'] = [];
    service.copy(selectedElementsArray);
    expect(service['properties'].moveTo).toEqual(0);
    expect(service['clipBoardArray']).toEqual(selectedElementsArray);
  });

  it('should call the paste method and set the correct values', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    service['svgElement'] = TestBed.get(ElementRef);
    service['svgElement'] = elementRef;
    service['renderer'] = TestBed.get(Renderer2);
    let test: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    service['svgElement'].nativeElement.childNodes = [];
    service['copySvg'] = test.cloneNode(true) as SVGAElement;
    service['copySvg'].tabIndex = 2;
    service['clipBoardArray'] = [];
    service['clipBoardArray'].push(test);
    service['drawingService'] = new DrawingService();
    service.paste();
    expect(service['clipBoardArray'].length).toEqual(1);
  });

  it('should call the delete method ', () => {
    const service: ClipboardService = new ClipboardService();
    let mockSVGElem: SVGElement;
    service['svgElement'] = TestBed.get(SVGElement);
    service['renderer'] = TestBed.get(Renderer2);
    service['drawingService'] = new DrawingService();
    mockSVGElem = TestBed.get(SVGElement);
    const selectedElementsArray: SVGElement[] = [mockSVGElem];
    renderer = TestBed.get(Renderer2);
    const spy = spyOn(renderer, 'removeChild');
    service.delete(selectedElementsArray);
    selectedElementsArray.forEach((element) => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should call the cut method ', () => {
    let selectedElementsArray: Node[] = [];
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    service['svgElement'] = TestBed.get(ElementRef);
    service['svgElement'] = elementRef;
    service['renderer'] = TestBed.get(Renderer2);
    let test: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    selectedElementsArray.push(test);
    service.cut(selectedElementsArray);
    expect(service['properties'].moveTo).toEqual(0);
    expect(selectedElementsArray).toEqual(service['clipBoardArray']);
  });

  it('should duplicate selected elements', () => {
    let selectedElementsArray: Node[] = [];
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    service['svgElement'] = TestBed.get(ElementRef);
    service['svgElement'] = elementRef;
    service['renderer'] = TestBed.get(Renderer2);
    let test: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    service['svgElement'].nativeElement.childNodes = [];
    service['copySvg'] = test.cloneNode(true) as SVGAElement;
    service['copySvg'].tabIndex = 2;
    selectedElementsArray.push(test);
    service['drawingService'] = new DrawingService();
    service.duplicate(selectedElementsArray);
    expect(selectedElementsArray).toEqual(service['duplicateArray']);
  });
});
