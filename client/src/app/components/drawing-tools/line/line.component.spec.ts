/* tslint:disable */

import { Component, ElementRef, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { LineComponent } from './line.component';

@Component({
  template: `<line></line>`,
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
describe('LineComponent', () => {
  let component: LineComponent;
  let fixture: ComponentFixture<LineComponent>;
  let renderer: Renderer2;
  let svgElement: ElementRef;
  let drawingService = new DrawingService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineComponent ],
      imports: [TestingImportsModule],
      providers: [{provide: ElementRef, useClass: MockSVGComponent}, {provide: Renderer2, useClass: MockRenderer}, DrawingService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineComponent);
    component = fixture.componentInstance;
    component = new LineComponent(renderer, svgElement, drawingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createPath and return the correct values', () => {
  const mockSVGComponent = new MockSVGComponent();
  const elementRef = new ElementRef(mockSVGComponent);
  renderer = TestBed.get(Renderer2);
  drawingService = new DrawingService();
  component = new LineComponent(renderer, elementRef, drawingService);
  component['properties'] = {pathString: 'abc', primaryColor: 'abs', width: 1};
  component.createPath(1, 1, 1, 'abc', 'abc', 1, 'round');
  expect(component['properties'].pathString).toEqual('M1,1M1,1');
  expect(component['properties'].primaryColor).toEqual('abc');
  expect(component['properties'].width).toEqual(1);
  expect(component['lineAttribs'].diameter).toEqual(1);
  expect(component['lineAttribs'].junction).toEqual('round');
  expect(component['lineAttribs'].xPointFirst).toEqual(1);
  expect(component['lineAttribs'].yPointFirst).toEqual(1);
  expect(component['lineAttribs'].currentLine).toEqual('M1,1M1,1');
  expect(component['properties'].pathString).toEqual(component['lineAttribs'].currentLine);
  expect(component['lineAttribs'].isDragged).toEqual(true);
});

  it('should call initialisation and return the correct values', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new LineComponent(renderer, elementRef, drawingService);
    component['properties'] = {pathString: 'abc', primaryColor: 'abs', width: 1};
    component['initialisation'](1, 1);
    expect(component['lineAttribs'].xFirst).toEqual(1);
    expect(component['lineAttribs'].yFirst).toEqual(1);
    expect(component['properties'].pathString).toEqual('M' + component['lineAttribs'].xFirst + ',' + component['lineAttribs'].yFirst);
    expect(component['lineAttribs'].currentLine).toEqual(component['properties'].pathString);
    expect(component['lineAttribs'].hasStarted).toEqual(true);
  });

  it('should call doubleClick and return the correct values', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new LineComponent(renderer, elementRef, drawingService);
    const event = new MouseEvent('dblclick');
    component.doubleClick(event);
    expect(component['lineAttribs'].isDragged).toEqual(false);
    expect(component['lineAttribs'].hasStarted).toEqual(false);
  });

  it('should call currentPosition and return the correct values if isDragged=true and esckey=true', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new LineComponent(renderer, elementRef, drawingService);
    component['properties'] = {pathString: 'abc', primaryColor: 'abs', width: 1};
    component['lineAttribs'].isDragged = true;
    component.currentPosition(1, 1, true);
    expect(component['lineAttribs'].currentLine).toEqual('abc');
  });

  it('should call currentPosition and return the correct values if isDragged=true and esckey=false', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new LineComponent(renderer, elementRef, drawingService);
    component['properties'] = {pathString: 'abc', primaryColor: 'abs', width: 1};
    component['lineAttribs'].isDragged = true;
    component.currentPosition(1, 1, false);
    expect(component['lineAttribs'].currentLine).toEqual('abcL1,1');
  });

  it('should call attributesPoint and return the correct values', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new LineComponent(renderer, elementRef, drawingService);
    component['properties'] = {pathString: 'abc', primaryColor: 'abs', width: 1};
    const spy = spyOn<any>(component, 'attributesPoint');
    component['attributesPoint']();
    expect(spy).toHaveBeenCalled();
  });
});
