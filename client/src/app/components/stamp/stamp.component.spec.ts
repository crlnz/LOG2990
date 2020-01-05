/* tslint:disable */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { StampComponent } from './stamp.component';
@Component({
  template: `<path></path>`,
})
class MockLineComponent {}
@Component({
  template: `<SVG></SVG>`,
})
class MockSVGComponent {}

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
    return new MockLineComponent();
  }
}
describe('EtampesComponent', () => {
  let component: StampComponent;
  let fixture: ComponentFixture<StampComponent>;
  let renderer: Renderer2;
  let drawingService: DrawingService;
  let svgElement: ElementRef;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StampComponent ],

      imports: [TestingImportsModule],
      providers: [{provide: ElementRef, useClass: MockSVGComponent}, {provide: Renderer2, useClass: MockRenderer}, DrawingService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the createPath method', () => {
    const stamp = 'abc';
    component['renderer'] = TestBed.get(Renderer2);
    component['svgElement'] = TestBed.get(ElementRef);
    component['drawingService'] = new DrawingService();
    const spy = spyOn<any>(component, 'stampAttributes');
    component['image'] = document.createElement('img') as HTMLImageElement;
    component.createPath(1, 1, 1, stamp);
    expect(stamp).toEqual('abc');
    expect(spy).toHaveBeenCalled();
  });
});
