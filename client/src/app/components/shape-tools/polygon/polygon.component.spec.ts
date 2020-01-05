/* tslint:disable */

import { Component, ElementRef, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { PolygonComponent } from './polygon.component';
class MockEvent {
  shiftkey = true;
}
class MockLine { }
@Component({
  template: `<Rect></Rect>`,
})
class MockSVGComponent { }
class MockRenderer {
  addClass(document: string, cssClass: string): boolean {
    return true;
  }
  appendChild(parent: any, child: any) {
    return;
  }
  createElement(name: string, element: string) {
    return new MockLine();
  }
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  removeChild(parent: any, child: any) {
    return;
  }
}
describe('PolygonComponent', () => {
  let component: PolygonComponent;
  let fixture: ComponentFixture<PolygonComponent>;
  let renderer: Renderer2;
  let drawingService: DrawingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolygonComponent ],
      imports: [TestingImportsModule],
      providers: [{ provide: ElementRef, useClass: MockSVGComponent }, { provide: Renderer2, useClass: MockRenderer }, DrawingService],
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PolygonComponent],
      imports: [TestingImportsModule],
      providers: [{ provide: ElementRef, useClass: MockSVGComponent }, { provide: Renderer2, useClass: MockRenderer }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonComponent);
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
    component = new PolygonComponent(renderer, elementRef, drawingService);
    const spy = spyOn(renderer, 'setAttribute');
    component.createPolygon('#eb4034', '#eb4034', 1, 'Ellipse');
    component.drawPolygon(1, 1, 1, 1, 1);
    expect(spy).toHaveBeenCalled();
  });

  it('should set fill', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new PolygonComponent(renderer, elementRef, drawingService);
    const spy = spyOn(renderer, 'setAttribute');
    component.createPolygon('#eb4034', '#eb4034', 1, 'Ellipse');
    component.drawPolygon(1, 1, 1, 1, 1);
    expect(spy).toHaveBeenCalled();
  });

  it('should set outline', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new PolygonComponent(renderer, elementRef, drawingService);
    const spy = spyOn(renderer, 'setAttribute');
    component.createPolygon('#eb4034', '#eb4034', 1, 'Ellipse');
    component.drawPolygon(1, 1, 1, 1, 1);
    expect(spy).toHaveBeenCalled();
  });

  it('should set fillOutline', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new PolygonComponent(renderer, elementRef, drawingService);
    const spy = spyOn(renderer, 'setAttribute');
    component.createPolygon('#eb4034', '#eb4034', 1, 'Ellipse');
    component.drawPolygon(1, 1, 1, 1, 1);
    expect(spy).toHaveBeenCalled();
  });

  it('should fill the ellipsis without stroke when the type is `Fill`', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new PolygonComponent(renderer, elementRef, drawingService);
    component.createPolygon('#eb4034', '#eb4034', 1, 'Ellipse');
    const spy = spyOn(renderer, 'setAttribute');
    component['properties'].type = 'Fill';
    component.drawPolygon(1, 1, 1, 1, 1);
    expect(spy).toHaveBeenCalled();
  });

  it('should outline the ellipsis without fill when the type is `Outline`', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new PolygonComponent(renderer, elementRef, drawingService);
    const spy = spyOn(renderer, 'setAttribute');
    component.createPolygon('#eb4034', '#eb4034', 1, 'Ellipse');
    component.drawPolygon(1, 1, 1, 1, 1);
    expect(spy).toHaveBeenCalled();
  });

  it('should fill the ellipsis and add an outline when the type is `FillOutline`', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new PolygonComponent(renderer, elementRef, drawingService);
    const spy = spyOn(renderer, 'setAttribute');
    component.createPolygon('#eb4034', '#eb4034', 1, 'Ellipse');
    component.drawPolygon(1, 1, 1, 1, 1);
    expect(spy).toHaveBeenCalled();
  });

  it('should change the values of x2 and y2 and add the delta value when the shiftKey is pressed', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new PolygonComponent(renderer, elementRef, drawingService);
    component.createPolygon('#eb4034', '#eb4034', 1, 'Ellipse');
    component.drawPolygon(1, 1, 1, 1, 1);
    expect(component['properties'].height).toEqual(component['properties'].width);
  });

  it('should push the rectangle only if its properties are defined', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new PolygonComponent(renderer, elementRef, drawingService);
    component.createPolygon('#eb4034', '#eb4034', 1, 'Polygon');
    component['properties'].height = 1;
    component['properties'].width = 1;
    const spy = spyOn(drawingService, 'fillDrawingArray');
    component.removePreview();
    expect(spy).toHaveBeenCalled();
  });

  it('should push the rectangle only if it exists', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new PolygonComponent(renderer, elementRef, drawingService);
    component['polygon'] = renderer.createElement('ellipse');
    component.createPolygon('#eb4034', '#eb4034', 1, 'Fill');
    component.drawPolygon(1, 1, 1, 1, 3);
    component.removePreview();
    expect(drawingService.drawingArray[0]).toEqual(component['polygon'].outerHTML);
  });

  it('should set the attributes for fill and stroke', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new PolygonComponent(renderer, elementRef, drawingService);
    component.createPolygon('#eb4034', '#eb4034', 1, 'Fill');
    const spy = spyOn(renderer, 'setAttribute');
    component['properties'].type = 'FillOutline';
    component.drawPolygon(1, 1, 1, 1, 1);
    expect(spy).toHaveBeenCalled();
  });

  it('should set the attributes for fill and stroke', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new PolygonComponent(renderer, elementRef, drawingService);
    component.createPolygon('#eb4034', '#eb4034', 1, 'Fill');
    const spy = spyOn(renderer, 'setAttribute');
    component['properties'].type = 'Outline';
    component.drawPolygon(1, 1, 1, 1, 1);
    expect(spy).toHaveBeenCalled();
  });
});
