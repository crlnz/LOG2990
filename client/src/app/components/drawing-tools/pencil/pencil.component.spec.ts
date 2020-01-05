/* tslint:disable */

import { Component, ElementRef, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { PencilComponent } from './pencil.component';
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
describe('PencilComponent', () => {
  let component: PencilComponent;
  let fixture: ComponentFixture<PencilComponent>;
  let renderer: Renderer2;
  let svgElement: ElementRef;
  let drawingService: DrawingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PencilComponent],
      imports: [TestingImportsModule],
      providers: [{provide: ElementRef, useClass: MockSVGComponent}, {provide: Renderer2, useClass: MockRenderer}, DrawingService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilComponent);
    component = fixture.componentInstance;
    component = new PencilComponent(renderer, svgElement, drawingService);
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
    component = new PencilComponent(renderer, elementRef, drawingService);
    const spy = spyOn(renderer, 'setAttribute');
    component.createPath(1, 1, 1, '1');
    component.drawPencil(1, 1);
    expect(spy).toHaveBeenCalled();
  });

});
