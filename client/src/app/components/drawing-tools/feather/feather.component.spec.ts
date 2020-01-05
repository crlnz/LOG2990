/* tslint:disable */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { FeatherComponent } from './feather.component';
import { DrawingToolProperties } from '../drawing-tool-properties';
@Component({
  template: `<path></path>`,
})
class MockSVGElement {}
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

describe('FeatherComponent', () => {
  let component: FeatherComponent;
  let fixture: ComponentFixture<FeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatherComponent ],
      imports: [TestingImportsModule],
      providers: [{provide: ElementRef, useClass: MockSVGComponent}, { provide: SVGElement, useClass: MockSVGElement }, {provide: Renderer2, useClass: MockRenderer}, DrawingService],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should createPath', () => {
    const drawingToolProperties:DrawingToolProperties={pathString:'1.5,1 1.5,1 0.5,1 0.5,1',primaryColor:'',width:1};
    spyOn<any>(component, 'splitColorString').and.callThrough();
    spyOn<any>(component, 'createContainer').and.callThrough();
    spyOn<any>(component, 'createSegment').and.callThrough();
    spyOn<any>(component, 'findCoordinates').and.callThrough();
    spyOn<any>(component, 'updateLeftCoordinates').and.callThrough();
    spyOn<any>(component, 'updateSegment').and.callThrough();
    component.createPath(1,1,1,'',100);
    expect(component['opacity']).toEqual(1);
    expect(component['properties']).toEqual(drawingToolProperties);
  });

  it('should drawFeather', () => {
    component['renderer'] = TestBed.get(Renderer2);
    const drawingToolProperties:DrawingToolProperties={pathString:'',primaryColor:'',width:1};
    const spy1=spyOn<any>(component, 'createSegment');
    const spy2=spyOn<any>(component, 'findCoordinates');
    const spy3=spyOn<any>(component, 'updateLeftCoordinates');
    const spy4=spyOn<any>(component, 'updateSegment');
    component.createPath(1,1,1,'',100);
    component.drawFeather(1,1);
    expect(component['properties']).toEqual(drawingToolProperties);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('should splitColorString', () => {
    component.createPath(1,1,1,'123456789',100);
    expect(component['properties'].primaryColor).toEqual(component['properties'].primaryColor.substring(0, 7 ));
  });

  it('should findCoordinates if angle=90', () => {
    component.createPath(1,1,1,'123456789',100);
    component['featherProperties'].angle=90;
    component.drawFeather(1,1);
    expect(component['featherProperties'].angle).toEqual(90);
    spyOn<any>(component, 'updateRightCoordinates').and.callThrough();
  });

  it('should findCoordinates if angle=50', () => {
    component.createPath(1,1,1,'red',100);
    component['featherProperties'].angle=50;
    component.drawFeather(1,1);
    expect(component['featherProperties'].angle).toEqual(50);
    spyOn<any>(component, 'updateRightCoordinates').and.callThrough();
  });

  it('should updateRightCoordinates if angle=50', () => {
    component.createPath(1,1,1,'red',100);
    component['featherProperties'].angle=50;
    component.drawFeather(1,1);
    expect(component['featherProperties'].angle).toEqual(50);
    spyOn<any>(component, 'updateRightCoordinates').and.callThrough();
    expect(component["featherProperties"].topRightY).toEqual(0.616977778440511);
    expect(component["featherProperties"].topRightX).toEqual( 1.3213938048432696);
    expect(component["featherProperties"].bottomRightX).toEqual(0.6786061951567304);
    expect(component["featherProperties"].bottomRightY).toEqual(1.383022221559489);
  });

  it('should updateLeftCoordinates if angle=50', () => {
    component.createPath(1,1,1,'red',100);
    component['featherProperties'].angle=50;
    component.drawFeather(1,1);
    expect(component['featherProperties'].angle).toEqual(50);
    spyOn<any>(component, 'updateRightCoordinates').and.callThrough();
    expect(component["featherProperties"].topLeftX).toEqual(1.5);
    expect(component["featherProperties"].topLeftY).toEqual(1);
    expect(component["featherProperties"].bottomLeftY).toEqual(1);
    expect(component["featherProperties"].bottomLeftX).toEqual(0.5);
  });

  it('should updateSegment ', () => {
    const spy1=spyOn(component['renderer'],'setAttribute');
    const spy2=spyOn(component['renderer'],'appendChild');
    component.createPath(1,1,1,'123456789',100);
    component.drawFeather(1,1);
    spyOn<any>(component, 'updateSegment').and.callThrough();
    expect(component['properties'].pathString).toEqual('1.5,1 1.5,1 0.5,1 0.5,1');
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should setAttributes when segmentAttributes is called ', () => {
    const spy1=spyOn(component['renderer'],'setAttribute');
    component.createPath(1,1,1,'123456789',100);
    component.drawFeather(1,1);
    spyOn<any>(component, 'createSegment').and.callThrough();
    spyOn<any>(component, 'segmentAttributes').and.callThrough();
    expect(component['properties'].pathString).toEqual('1.5,1 1.5,1 0.5,1 0.5,1');
    expect(spy1).toHaveBeenCalled();
  });

  it('should createSegment', () => {
    component['renderer'] = TestBed.get(Renderer2);
    component['drawingService'] = new DrawingService();
    component['properties']={pathString:'',primaryColor:'red',width:1};
    const opacity: number = 30;
    spyOn<any>(component, 'createSegment').and.callThrough();
    component.createPath(1,1,1,'red',opacity);
    expect(component['opacity']).toEqual(opacity/100);
    expect(component['segment']).toBeDefined();
  });

  it('should createContainer', () => {
    component['renderer'] = TestBed.get(Renderer2);
    component['drawingService'] = new DrawingService();
    component['properties']={pathString:'',primaryColor:'red',width:1};
    const opacity: number = 30;
    spyOn<any>(component, 'createContainer').and.callThrough();
    component.createPath(1,1,1,'red',opacity);
    expect(component['opacity']).toEqual(opacity/100);
    expect(component['container']).toBeDefined();
  });
  it('should removeNull', () => {
    component['drawingService'] = new DrawingService();
    component['container'] = document.createElementNS('http://www.w3.org/2000/svg','g') as SVGElement;
    const spy = spyOn(component['drawingService'], 'fillDrawingArray');
    component.removeNull();
    expect(spy).toHaveBeenCalled();
  });
});
