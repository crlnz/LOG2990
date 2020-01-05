/* tslint:disable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { DrawingToolProperties } from '../drawing-tool-properties';
import { SprayPaintComponent } from './spray-paint.component';
@Component({
  template: `<path></path>`,
})
class MockSVGElement { }
class MockLineComponent { }
@Component({
  template: `<SVG></SVG>`,
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
    return new MockLineComponent();
  }
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  removeChild(parent: any, child: any) {
    return;
  }
}
describe('SprayPaintComponent', () => {
  let component: SprayPaintComponent;
  let fixture: ComponentFixture<SprayPaintComponent>;
  let renderer: Renderer2;
  let svgElement: ElementRef;
  let drawingService: DrawingService;
  let drawingToolProperties: DrawingToolProperties;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SprayPaintComponent],
      imports: [TestingImportsModule],
      providers: [{ provide: ElementRef, useClass: MockSVGComponent }, { provide: SVGElement, useClass: MockSVGElement }, { provide: Renderer2, useClass: MockRenderer }, DrawingService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprayPaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should createPoint', () => {
    const spy1 = spyOn(component['renderer'], 'appendChild');
    const spy2 = spyOn(component['renderer'], 'setAttribute')
    component.createPoint(1, 1, 1, '', 1);
    expect(component['properties']).toEqual({ primaryColor: '', diameter: 1, x: 1, y: 1, emission: 1 });
    expect(component['container']).toEqual(component['renderer'].createElement('g', 'http://www.w3.org/2000/svg'));
    expect(component['pathString']).toEqual('M1,1');
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    spyOn<any>(component, 'airBrush').and.callThrough();
  });

  it('should removeNull', () => {
    component['drawingService'] = new DrawingService();
    const spy = spyOn(component['drawingService'], 'fillDrawingArray');
    component['container'] = TestBed.get(SVGElement);
    component.removeNull();
    expect(spy).toHaveBeenCalled();
  });

  it('should drawSprayPaint', () => {
    component.createPoint(1, 1, 1, '', 1);
    component.drawSprayPaint(1, 1);
    expect(component['properties'].x).toEqual(1);
    expect(component['properties'].y).toEqual(1);
  });
  it('should airBrush', () => {
    component['renderer'] = TestBed.get(Renderer2);
    component['drawingService'] = new DrawingService();
    component.createPoint(1, 1, 1, '', 1);
    component['spray'] = 1;
    spyOn(global, 'setInterval').and.callThrough();
    component['airBrush']();
    expect(global['setInterval']).toHaveBeenCalled();
  });
});
