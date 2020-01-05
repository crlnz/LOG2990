/* tslint:disable */

import { Component, ElementRef, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { RectangleComponent } from './rectangle.component';
class MockEvent {
  constructor() {}
  shiftkey = true;
}
class MockLine {
  width = 1;
  height = 1;
}
@Component({
  template: `<rect></rect>`,
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
    return new MockLine();
  }
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  removeChild(parent: any , child: any) {
    return ;
  }
}
describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;
  let renderer: Renderer2;
  let drawingService: DrawingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleComponent ],
      imports : [TestingImportsModule],
      providers: [{provide: ElementRef, useClass: MockSVGComponent}, {provide: Renderer2, useClass: MockRenderer}, DrawingService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should draw', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new RectangleComponent(renderer, elementRef, drawingService);
    const spy = spyOn(renderer, 'setAttribute');
    const event = new MouseEvent('mousedown');
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    component.drawRectangle(1, 1, 1, 1, event);
    expect(spy).toHaveBeenCalled();
  });
  it('should set fill', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new RectangleComponent(renderer, elementRef, drawingService);
    const spy = spyOn(renderer, 'setAttribute');
    const event = new MouseEvent('click');
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    component.drawRectangle(1, 1, 1, 1, event);
    expect(spy).toHaveBeenCalled();
  });
  it('should set outline', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new RectangleComponent(renderer, elementRef, drawingService);
    const spy = spyOn(renderer, 'setAttribute');
    const event = new MouseEvent('click');
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    component.drawRectangle(1, 1, 1, 1, event);
    expect(spy).toHaveBeenCalled();
  });
  it('should set fillOutline', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new RectangleComponent(renderer, elementRef, drawingService);
    const spy = spyOn(renderer, 'setAttribute');
    const event = new MouseEvent('click');
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    component.drawRectangle(1, 1, 1, 1, event);
    expect(spy).toHaveBeenCalled();
  });

  it('should fill the rectangle without stroke when the type is `Fill`', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new RectangleComponent(renderer, elementRef, drawingService);
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    const spy = spyOn(renderer, 'setAttribute');
    const event = new MouseEvent('click');
    component['properties'].type = 'Fill';
    component.drawRectangle(1, 1, 1, 1, event);
    expect(spy).toHaveBeenCalled();
  });

  it('should outline the rectangle without fill when the type is `Outline`', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new RectangleComponent(renderer, elementRef, drawingService);
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    const spy = spyOn(renderer, 'setAttribute');
    const event = new MouseEvent('click');
    component['properties'].type = 'Outline';
    component.drawRectangle(1, 1, 1, 1, event);
    expect(spy).toHaveBeenCalled();
  });

  it('should fill the rectangle and add an outline when the type is `FillOutline`', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new RectangleComponent(renderer, elementRef, drawingService);
    const spy = spyOn(renderer, 'setAttribute');
    const event = new MouseEvent('click');
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    component.drawRectangle(1, 1, 1, 1, event);
    expect(spy).toHaveBeenCalled();
  });

  it('should change the values of x2 and y2 and add the delta value when the shiftKey is pressed', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new RectangleComponent(renderer, elementRef, drawingService);
    const event = new MouseEvent('click', {
      shiftKey: true,
    });
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    component.drawRectangle(1, 1, 1, 1, event);
    expect(component['properties'].height).toEqual(component['properties'].width);
  });

  it('should push the rectangle only if it exists', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new RectangleComponent(renderer, elementRef, drawingService);
    const event = new MouseEvent('mousemove');
    component['rect'] = renderer.createElement('rect');
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    component.drawRectangle(1, 1, 1, 1, event);
    component.removeNull();
    expect(drawingService.drawingArray[0]).toEqual(component['rect'].outerHTML);
  });

  it('should set the attributes for fill and stroke', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new RectangleComponent(renderer, elementRef, drawingService);
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    const spy = spyOn(renderer, 'setAttribute');
    const event = new MouseEvent('click');
    component['properties'].type = 'FillOutline';
    component.drawRectangle(1, 1, 1, 1, event);
    expect(spy).toHaveBeenCalled();
  });

  it('should push the rectangle only if its properties are defined', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new RectangleComponent(renderer, elementRef, drawingService);
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    component['properties'].height = 1;
    component['properties'].width = 1;
    const spy = spyOn(drawingService, 'fillDrawingArray');
    component.removeNull();
    expect(spy).toHaveBeenCalled();
  });

});
