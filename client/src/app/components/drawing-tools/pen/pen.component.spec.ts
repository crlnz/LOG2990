/* tslint:disable */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenComponent } from './pen.component';
import { Component, Renderer2, ElementRef } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { DrawingToolProperties } from '../drawing-tool-properties';
import { PenProperties } from './pen-properties';
@Component({
  template: `<path></path>`,
})
class MockLineComponent {}
@Component({
  template: `<SVG></SVG>`,
})
class MockSVGComponent {}
class MockRenderer {
  addClass(document: string, cssClass: string): boolean {
    return true;
  }
  appendChild(parent: any , child: any) {
    return ;
  }
  createElement(name: string, element: string) {
    return new MockLineComponent();
  }
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  removeChild(parent: any, child: any) {
    return;
  }
}
describe('PenComponent', () => {
  let component: PenComponent;
  let fixture: ComponentFixture<PenComponent>;
  let renderer: Renderer2;
  let svgElement: ElementRef;
  let drawingService: DrawingService;
  let drawingToolProperties:DrawingToolProperties;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PenComponent],
      imports: [TestingImportsModule],
      providers: [{provide: ElementRef, useClass: MockSVGComponent}, {provide: Renderer2, useClass: MockRenderer}, DrawingService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenComponent);
    component = fixture.componentInstance;
    component = new PenComponent(renderer, svgElement, drawingService);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should drawPen', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    const drawingToolProperties:DrawingToolProperties={pathString:'',primaryColor:'',width:1};
    component = new PenComponent(renderer, elementRef, drawingService);
    component['properties']=drawingToolProperties;
    const penProperties:PenProperties={previousTime:1,previousX:1,previousY:1,speedX:1,speedY:1,maxTip:1,minTip:1,currentTipWithSpeed:1,previousTipWithSpeed:1}
    component['penProperties']=penProperties;
    component['opacity'] = 1;
    component.drawPen(1,1);
    spyOn<any>(component, 'calculateMouseSpeed').and.callThrough();
    spyOn<any>(component, 'calculateTipSizeWithSpeed').and.callThrough();
    spyOn<any>(component, 'smoothSegments').and.callThrough();
    spyOn<any>(component, 'createNewSegment').and.callThrough();
    expect(component['penProperties'].previousTipWithSpeed).toEqual(1);
  });

  it('should calculateTipSizeWithSpeed', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    const penProperties:PenProperties={previousTime:1,previousX:1,previousY:1,speedX:1,speedY:1,maxTip:1,minTip:1,currentTipWithSpeed:1,previousTipWithSpeed:1}
    let drawingToolProperties: DrawingToolProperties ={pathString:'',primaryColor:'',width:1};
    component = new PenComponent(renderer, elementRef, drawingService);
    component['penProperties']=penProperties;
    component['calculateTipSizeWithSpeed']();
    expect(component['penProperties'].currentTipWithSpeed).toEqual(component['penProperties'].maxTip - (Math.max(Math.abs(component['penProperties'].speedX), 
    Math.abs(component['penProperties'].speedY)) / 12));
    
  });

  it('should createNewSegment', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    const penProperties:PenProperties={previousTime:1,previousX:1,previousY:1,speedX:1,speedY:1,maxTip:1,minTip:1,currentTipWithSpeed:1,previousTipWithSpeed:1}
    const drawingToolProperties:DrawingToolProperties={pathString:'',primaryColor:'',width:1};
    const spy = spyOn(renderer, 'setAttribute');
    const spy2 = spyOn(renderer, 'createElement');
    component = new PenComponent(renderer, elementRef, drawingService);
    component['penProperties']=penProperties;
    component['properties']=drawingToolProperties;
    component['opacity'] = 1;
    component['createNewSegment'](1,1);
    expect(component['properties'].pathString).toEqual('M' + ' ' + '1' + ' ' + '1' + ' ')
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    spyOn<any>(component, 'attributePath').and.callThrough();
  });

  it('should createPath', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    const penProperties:PenProperties={previousTime:1,previousX:1,previousY:1,speedX:1,speedY:1,maxTip:1,minTip:1,currentTipWithSpeed:1,previousTipWithSpeed:1}
    const drawingToolProperties:DrawingToolProperties={pathString:'',primaryColor:'',width:1};
    const spy = spyOn(renderer, 'appendChild');
    const spy2 = spyOn(renderer, 'createElement');
    component = new PenComponent(renderer, elementRef, drawingService);
    component['penProperties']=penProperties;
    component['properties']=drawingToolProperties;
    component.createPath(1,1,'',1,1,1);
    expect(component['penProperties'].maxTip).toEqual(1);
    expect(component['penProperties'].minTip).toEqual(1);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    spyOn<any>(component, 'createNewSegment').and.callThrough();
    spyOn<any>(component, 'setAttributesPoint').and.callThrough();
  });
  it('should setAttributesPoint', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    const penProperties:PenProperties={previousTime:1,previousX:1,previousY:1,speedX:1,speedY:1,maxTip:1,minTip:1,currentTipWithSpeed:1,previousTipWithSpeed:1}
    const drawingToolProperties:DrawingToolProperties={pathString:'',primaryColor:'',width:1};
    const spy = spyOn(renderer, 'setAttribute');
    component = new PenComponent(renderer, elementRef, drawingService);
    component['opacity'] = 1;
    component['penProperties']=penProperties;
    component['properties']=drawingToolProperties;
    component['setAttributesPoint'](1,1,1);
    expect(spy).toHaveBeenCalled();
  });
  it('should attributePath', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    const penProperties:PenProperties={previousTime:1,previousX:1,previousY:1,speedX:1,speedY:1,maxTip:1,minTip:1,currentTipWithSpeed:1,previousTipWithSpeed:1}
    const drawingToolProperties:DrawingToolProperties={pathString:'',primaryColor:'',width:1};
    const spy = spyOn(renderer, 'setAttribute');
    component = new PenComponent(renderer, elementRef, drawingService);
    component['opacity'] = 1;
    component['penProperties']=penProperties;
    component['properties']=drawingToolProperties;
    component['attributePath']();
    expect(spy).toHaveBeenCalled();
  });

  it('should removeNull', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    const penProperties:PenProperties={previousTime:1,previousX:1,previousY:1,speedX:1,speedY:1,maxTip:1,minTip:1,currentTipWithSpeed:1,previousTipWithSpeed:1}
    const drawingToolProperties:DrawingToolProperties={pathString:'',primaryColor:'',width:1};
    component = new PenComponent(renderer, elementRef, drawingService);
    component['penProperties']=penProperties;
    component['properties']=drawingToolProperties;
    component.removeNull();
    spyOn(component['drawingService'], 'fillDrawingArray').and.callThrough();
    expect(component['penProperties'].previousTipWithSpeed).toEqual(component['penProperties'].maxTip);
  });

  it('should calculateMouseSpeed', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    const penProperties:PenProperties={previousTime:1,previousX:1,previousY:1,speedX:1,speedY:1,maxTip:1,minTip:1,currentTipWithSpeed:1,previousTipWithSpeed:1}
    const drawingToolProperties:DrawingToolProperties={pathString:'',primaryColor:'',width:1};
    component = new PenComponent(renderer, elementRef, drawingService);
    component['penProperties']=penProperties;
    component['properties']=drawingToolProperties;
    component['penProperties'].previousTime=0;
    component['calculateMouseSpeed'](1,1);
    spyOn(component['drawingService'], 'fillDrawingArray').and.callThrough();
    expect(component['penProperties'].previousX).toEqual(1);
    expect(component['penProperties'].previousY).toEqual(1);
  });

  it('should smoothSegments', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    const penProperties:PenProperties={previousTime:1,previousX:1,previousY:1,speedX:1,speedY:1,maxTip:1,minTip:1,currentTipWithSpeed:1,previousTipWithSpeed:2}
    const drawingToolProperties:DrawingToolProperties={pathString:'',primaryColor:'',width:1};
    component = new PenComponent(renderer, elementRef, drawingService);
    component['penProperties']=penProperties;
    component['properties']=drawingToolProperties;
    component['penProperties'].previousTime=0;
    component['smoothSegments']();
    expect(component['penProperties'].currentTipWithSpeed).toEqual(1.9);
  });
});