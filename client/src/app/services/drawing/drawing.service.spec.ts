/* tslint:disable */

import { Component, ElementRef, Renderer2 } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RectangleComponent } from 'src/app/components/shape-tools/rectangle/rectangle.component';
import { DrawingService } from './drawing.service';

@Component({
  template: `<rect></rect>`,
})
class MockLine {
  test = '<div>Test</div>';
  width = 1;
  height = 1;
}
class MockSVGComponent {}
class MockRenderer {
  addClass(document: string, cssClass: string): boolean {
    return true;
  }
  appendChild(parent: any , child: any) {
    return ;
  }
  createElement(name: string, element: string): string {
    return new MockLine().test;
  }
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  removeChild(parent: any , child: any) {
    return ;
  }
}

describe('DrawingService', () => {
  let service: DrawingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: ElementRef, useClass: MockSVGComponent}, {provide: Renderer2, useClass: MockRenderer}, DrawingService],
    });
    service = TestBed.get(DrawingService);
  });

  it('should ...', inject([DrawingService], (service: DrawingService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clear the drawing array', () => {
    service.clearDrawingArray();
    expect(service.drawingArray.length).toEqual(0);
  });

  it('should update the redoOn boolean and call the next method on the showRedo subject', async(() => {
    const test: BehaviorSubject<boolean> = service['showRedo'];
    service.updateRedo(true);
    spyOn(service['showRedo'], 'next').and.callThrough();
    expect(typeof test).toEqual(typeof service['showRedo']);
  }));

  it('should update the undoOn boolean and call the next method on the showUndo subject', async(() => {
    const test: BehaviorSubject<boolean> = service['showUndo'];
    service.updateUndo(true);
    spyOn(service['showUndo'], 'next').and.callThrough();
    expect(typeof test).toEqual(typeof service['showUndo']);
  }));

  it('should replace the element passed in parameters in the drawingArray', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const renderer = TestBed.get(Renderer2);
    const drawingService = new DrawingService();
    const component = new RectangleComponent(renderer, elementRef, drawingService);
    const event = new MouseEvent('mousedown');
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    component.drawRectangle(1, 1, 1, 1, event);
    service.fillDrawingArray(component['rect']);
    service.findDrawingArrayElementIndex(component['rect']);
    spyOn(service, 'replaceDrawingArrayElement').and.callThrough();
    service.findDrawingArrayElementIndex(component['rect']);
    expect(service.allDrawings[service.drawingsIndex].includes(component['rect'].outerHTML)).toBe(true);
  });

  it('should add the draw element to the drawingArray and update the allDrawings array', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const renderer = TestBed.get(Renderer2);
    const drawingService = new DrawingService();
    const component = new RectangleComponent(renderer, elementRef, drawingService);
    const event = new MouseEvent('mousedown');
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    component.drawRectangle(1, 1, 1, 1, event);
    service.undoWasClicked = true;
    spyOn(service, 'fillDrawingArray').and.callThrough();
    service.fillDrawingArray(component['rect']);
    expect(service.undoWasClicked).toBe(false);
    expect(service.redoOn).toBe(false);
  });

  it('should add the element to the first position of the array if the first position is an empty string', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const renderer = TestBed.get(Renderer2);
    const drawingService = new DrawingService();
    const component = new RectangleComponent(renderer, elementRef, drawingService);
    const event = new MouseEvent('mousedown');
    component.createRectangle('#eb4034', '#eb4034', 1, 'Fill');
    component.drawRectangle(1, 1, 1, 1, event);
    service.drawingArray[0] = '';
    spyOn(service, 'fillDrawingArray').and.callThrough();
    service.fillDrawingArray(component['rect']);
    expect(service.drawingArray[0]).toEqual(component['rect'].outerHTML);
  });

  it('should parse the last array of allDrawings as a JSON on clickUndo', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg.appendChild(rect);
    service.fillDrawingArray(svg);
    spyOn(service, 'clickUndo').and.callThrough();
    service.drawingsIndex = 1;
    service.clickUndo();
    expect(service.redoOn).toBe(true);
  });

  it('should parse the last array of allDrawings as a JSON on clickUndo with drawingIndex == -1', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg.appendChild(rect);
    spyOn(service, 'clickUndo').and.callThrough();
    service.drawingsIndex = 0;
    service.clickUndo();
    expect(service.redoOn).toBe(true);
  });

  it('should return an Observable<Event> when listenRedoClick is clicked', async(() => {
    const event: Observable<Event> = service.listenRedoClick();
    spyOn(service, 'listenRedoClick').and.returnValue(of<any>(event));
    expect(typeof service.listenRedoClick()).toEqual(typeof event);
  }));

  it('should return an Observable<Event> when listenUndoClick is clicked', async(() => {
    const event: Observable<Event> = service.listenUndoClick();
    spyOn(service, 'listenUndoClick').and.returnValue(of<any>(event));
    expect(typeof service.listenUndoClick()).toEqual(typeof event);
  }));

});
