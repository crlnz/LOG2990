/* tslint:disable */

import { Component, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ClipboardService } from '../clipboard/clipboard.service';
import { SelectionService, Rectangle } from './selection.service';
import { DrawingService } from '../drawing/drawing.service';
import { RectangleComponent } from 'src/app/components/shape-tools/rectangle/rectangle.component';
import { SelectionProperties } from './selection-properties';
@Component({
  template: `<SVG></SVG>`,
})
class MockSVGComponent {
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
  appendChild(parent: any , child: any) {
    return ;
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
describe('SelectionService', () => {
  let service: SelectionService;
  let clipboardService: ClipboardService;
  let renderer: Renderer2;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: SVGElement, useClass: MockSVGElement}, {provide: ElementRef, useClass: MockSVGComponent}, SelectionService, {provide: SVGGraphicsElement, useClass: MockSVGGraphicsElement}, {provide: ElementRef, useClass: MockSVGComponent},
        {provide: Renderer2, useClass: MockRenderer}, {provide: RendererFactory2, useClass : MockRendererFactory}, RectangleComponent],
    });
    service = TestBed.get(SelectionService);
  });

  it('should be created', () => {
    const service: SelectionService = TestBed.get(SelectionService);
    expect(service).toBeTruthy();
  });
  
  it('should call the initialisation method and return the correct values', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    expect(service['properties'].svgElement).toEqual(elementRef);
    expect(service['properties'].renderer).toEqual(rendererFactory.createRenderer(null, null));
  });

  it('should call the setToolbarWidth method and return the correct toolbarWidth', () => {
    const width = 10;
    service.setToolbarWidth(width);
    expect(service['properties'].toolbarWidth).toEqual(width);
  });

  it('should call the setAmountScrolled method and return the correct amountScrolledX and amountScrolledY', () => {
    const amountX = 10;
    const amountY = 10;
    service.setAmountScrolled(amountX, amountY);
    expect(service['properties'].amountScrolledX).toEqual(amountX);
    expect(service['properties'].amountScrolledY).toEqual(amountY);
  });


  it('should remove controls', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    const spy = spyOn(service['properties'].renderer, 'removeChild');
    service.removeControls();
    expect(spy).toHaveBeenCalled();
    expect(service.controlsBoxCreated).toEqual(false);
  });

  it('should create delete', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    service['selectedBox'] = {x: 10, y: 10, height: 10, width: 10};
    const spy2 = spyOn(service['clipboardService'], 'delete');
    const spy3 = spyOn(service, 'removeControls');
    service.delete();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should create cut', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    service['selectedBox'] = {x: 10, y: 10, height: 10, width: 10};
    const spy2 = spyOn(service['clipboardService'], 'cut');
    const spy3 = spyOn(service, 'removeControls');
    service.cut();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should create duplicate', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    service['selectedBox'] = {x: 10, y: 10, height: 10, width: 10};
    const spy2 = spyOn(service['clipboardService'], 'duplicate');
    const spy3 = spyOn(service, 'removeControls');
    service.duplicate();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should create paste', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    service['selectedBox'] = {x: 10, y: 10, height: 10, width: 10};
    const spy2 = spyOn(service['clipboardService'], 'paste');
    const spy3 = spyOn(service, 'removeControls');
    service.paste();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should create copy', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    service['selectedBox'] = {x: 10, y: 10, height: 10, width: 10};
    const spy2 = spyOn(service['clipboardService'], 'copy');
    const spy3 = spyOn(service, 'setClipboardArray');
    service.copy();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should create arrayClipboard', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    service['selectedBox'] = {x: 10, y: 10, height: 10, width: 10};
    expect(service['properties'].clipboardElements).toEqual([]);
  });


  it('should create setControlProperties', () => {
    const control = service['properties'].topLeft;
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    service['selectedBox'] = {x: 10, y: 10, height: 10, width: 10};
    const spy2 = spyOn(service['properties'].renderer, 'setAttribute');
    service['setControlProperties'](control);
    expect(spy2).toHaveBeenCalled();
  });

  it('should call drawSelect', () => {
    const event = new MouseEvent('click');
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    service['selectedBox'] = {x: 10, y: 10, height: 10, width: 10};
    const spy2 = spyOn(service['properties'].renderer, 'setAttribute');
    service['drawSelect'](1, 1, 2, 2);
    expect(spy2).toHaveBeenCalled();
  });

  it('should call createSelect', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    service['selectedBox'] = {x: 10, y: 10, height: 10, width: 10};
    const spy2 = spyOn(service['properties'].renderer, 'appendChild');
    service['createSelect']();
    expect(service['properties'].selectionBox).toEqual(service['properties'].renderer.createElement('rect', 'http://www.w3.org/2000/svg'));
    expect(spy2).toHaveBeenCalled();
  });

  it('should return an Observable bool', async(() => {
    const bool: Observable<boolean> = service.getClipboardArray();
    spyOn(service['stateArray'], 'asObservable').and.returnValue(of<any>(bool));
    expect(typeof service.getClipboardArray()).toEqual(typeof bool);
  }));

  it('should update the stateArray boolean and call the next method', async(() => {
    const test: BehaviorSubject<boolean> = service['stateArray'];
    service.setClipboardArray(true);
    spyOn(service['stateArray'], 'next').and.callThrough();
    expect(typeof test).toEqual(typeof service['stateArray']);
  }));

  it('should return an Observable bool', async(() => {
    const bool: Observable<boolean> = service.getBoxCreated();
    spyOn(service['stateBox'], 'asObservable').and.returnValue(of<any>(bool));
    expect(typeof service.getBoxCreated()).toEqual(typeof bool);
  }));

  it('should update the stateArray boolean and call the next method', async(() => {
    const test: BehaviorSubject<boolean> = service['stateBox'];
    service.setBoxCreated(true);
    spyOn(service['stateBox'], 'next').and.callThrough();
    expect(typeof test).toEqual(typeof service['stateBox']);
  }));

  it('should call removeControls', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    const spy = spyOn(service['properties'].renderer, 'removeChild');
    const spy2 = spyOn(service, 'setBoxCreated');
    service.removeControls();
    expect(spy).toHaveBeenCalled();
    expect(service.controlsBoxCreated).toEqual(false);
    expect(spy2).toHaveBeenCalled();
  });

  it('should call rotateAlt', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    service['controlsBoxCreated']=true;
    const spy = spyOn<any>(service, 'calculateRectangle');
    const spy2 = spyOn(service, 'removeControls');
    const spy3 = spyOn(service, 'replaceRotateElements');
    const spy4 = spyOn(service['manipulationService'], 'rotateByBox');
    service.rotateAlt(1);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(service['rotate']).toEqual(-1);
  });

  it('should call rotateNormal', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    service['controlsBoxCreated']=true;
    const spy = spyOn<any>(service, 'calculateRectangle');
    const spy2 = spyOn(service, 'removeControls');
    const spy3 = spyOn(service, 'replaceRotateElements');
    const spy4 = spyOn(service['manipulationService'], 'rotateByBox');
    const spy5 = spyOn(service, 'findSelectedElements');
    service.rotateNormal(15);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
    expect(service['rotate']).toEqual(-15);
  });

  it('should call rotateShift', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    service['controlsBoxCreated']=true;
    const spy = spyOn<any>(service, 'calculateRectangle');
    const spy2 = spyOn(service, 'removeControls');
    const spy3 = spyOn(service, 'replaceRotateElements');
    const spy4 = spyOn(service['manipulationService'], 'rotateByElement');
    const spy5 = spyOn(service, 'findSelectedElements');
    service.rotateShift(15);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
    expect(service['rotate']).toEqual(-15);
  });

  it('should call updateMagneticPoint magneticPoint=topLeft', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    service['magneticPoint']='topLeft';
    service['selectedBox']={} as Rectangle;
    service.updateMagneticPoint();
    expect(service['manipulationService'].x1SelectedBox).toEqual(service['selectedBox'].x);
    expect(service['manipulationService'].y1SelectedBox).toEqual(service['selectedBox'].y);
  });

  it('should call updateMagneticPoint magneticPoint=topRight', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    service['magneticPoint']='topRight';
    service['selectedBox']={} as Rectangle;
    service.updateMagneticPoint();
    expect(service['manipulationService'].x1SelectedBox).toEqual(service['selectedBox'].x+ service['selectedBox'].width);
    expect(service['manipulationService'].y1SelectedBox).toEqual(service['selectedBox'].y);
  });

  it('should call updateMagneticPoint magneticPoint=topMid', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    service['magneticPoint']='topMid';
    service['selectedBox']={} as Rectangle;
    service.updateMagneticPoint();
    expect(service['manipulationService'].x1SelectedBox).toEqual(service['selectedBox'].x+ service['selectedBox'].width/2);
    expect(service['manipulationService'].y1SelectedBox).toEqual(service['selectedBox'].y);
  });

  it('should call updateMagneticPoint magneticPoint=center', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    service['magneticPoint']='center';
    service['selectedBox']={} as Rectangle;
    service.updateMagneticPoint();
    expect(service['manipulationService'].x1SelectedBox).toEqual(service['selectedBox'].x+ service['selectedBox'].width/2);
    expect(service['manipulationService'].y1SelectedBox).toEqual(service['selectedBox'].y+ service['selectedBox'].height/2);
  });

  it('should call updateMagneticPoint magneticPoint=midRight', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    service['magneticPoint']='midRight';
    service['selectedBox']={} as Rectangle;
    service.updateMagneticPoint();
    expect(service['manipulationService'].x1SelectedBox).toEqual(service['selectedBox'].x+ service['selectedBox'].width);
    expect(service['manipulationService'].y1SelectedBox).toEqual(service['selectedBox'].y+ service['selectedBox'].height/2);
  });

  it('should call updateMagneticPoint magneticPoint=midLeft', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    service['magneticPoint']='midLeft';
    service['selectedBox']={} as Rectangle;
    service.updateMagneticPoint();
    expect(service['manipulationService'].x1SelectedBox).toEqual(service['selectedBox'].x);
    expect(service['manipulationService'].y1SelectedBox).toEqual(service['selectedBox'].y+ service['selectedBox'].height/2);
  });

  it('should call updateMagneticPoint magneticPoint=bottomLeft', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    service['magneticPoint']='bottomLeft';
    service['selectedBox']={} as Rectangle;
    service.updateMagneticPoint();
    expect(service['manipulationService'].x1SelectedBox).toEqual(service['selectedBox'].x);
    expect(service['manipulationService'].y1SelectedBox).toEqual(service['selectedBox'].y+ service['selectedBox'].height);
  });

  it('should call updateMagneticPoint magneticPoint=bottomRight', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    service['magneticPoint']='bottomRight';
    service['selectedBox']={} as Rectangle;
    service.updateMagneticPoint();
    expect(service['manipulationService'].x1SelectedBox).toEqual(service['selectedBox'].x+service['selectedBox'].width);
    expect(service['manipulationService'].y1SelectedBox).toEqual(service['selectedBox'].y+ service['selectedBox'].height);
  });

  it('should call updateMagneticPoint magneticPoint=bottomMid', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    service['magneticPoint']='bottomMid';
    service['selectedBox']={} as Rectangle;
    service.updateMagneticPoint();
    expect(service['manipulationService'].x1SelectedBox).toEqual(service['selectedBox'].x+service['selectedBox'].width/2);
    expect(service['manipulationService'].y1SelectedBox).toEqual(service['selectedBox'].y+ service['selectedBox'].height);
  });
  it('should call setControlProperties', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const clipboardService = new ClipboardService();
    const drawingService = new DrawingService();
    const rendererFactory = TestBed.get(RendererFactory2);
    service.initialisation(rendererFactory, elementRef, clipboardService, drawingService);
    renderer = TestBed.get(Renderer2);
    const control: SVGElement = TestBed.get(SVGElement);
    const spy = spyOn(service['properties'].renderer, 'setAttribute');
    service['setControlProperties'](control);
    expect(spy).toHaveBeenCalled();
  });
});
