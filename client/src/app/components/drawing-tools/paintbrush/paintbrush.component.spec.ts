/* tslint:disable */

import { Component, ElementRef, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { PaintbrushComponent } from './paintbrush.component';
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
  removeChild(element: any, element2: any) {
    return;
  }
}
describe('PaintbrushComponent', () => {
  let component: PaintbrushComponent;
  let fixture: ComponentFixture<PaintbrushComponent>;
  let renderer: Renderer2;
  let drawingService: DrawingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintbrushComponent],
      imports: [TestingImportsModule],
      providers: [{provide: ElementRef, useClass: MockSVGComponent}, {provide: Renderer2, useClass: MockRenderer}, DrawingService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintbrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

  });
  it('should call draw', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    component = new PaintbrushComponent(renderer, elementRef, drawingService);
    const spy = spyOn(renderer, 'setAttribute');
    component.createPaintbrush(1, 1, '1', 1, '1');
    component.drawPaintbrush(1, 1);
    expect(spy).toHaveBeenCalled();
  });
});
