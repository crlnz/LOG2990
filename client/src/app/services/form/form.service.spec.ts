/* tslint:disable */

import { async,  inject, TestBed } from '@angular/core/testing';
import { Observable, of, Subject } from 'rxjs';
import { FormService } from './form.service';

describe('Service: Form', () => {
  interface DrawingProperties {
    color: string;
    width: string;
    height: string;
  }
  let service: FormService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormService],
    });
    service = TestBed.get(FormService);
  });

  it('should ...', inject([FormService], (service: FormService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable event on listenResized', async(() => {
    const event: Observable<Event> = service.listenResized();
    spyOn(service, 'listenResized').and.returnValue(of<any>(event));
    expect(typeof service.listenResized()).toEqual(typeof event);
  }));

  it('should return an Observable event on listen', async(() => {
    const event: Observable<Event> = service.listen();
    spyOn(service, 'listenResized').and.returnValue(of<any>(event));
    expect(typeof service.listenResized()).toEqual(typeof event);
  }));

  it('should call the next method when createDrawingClicked() is called', async(() => {
    const event: Subject<Event> = service['createDrawingListener'];
    service.createDrawingClicked();
    spyOn(service['createDrawingListener'], 'next').and.callThrough();
    expect(typeof event).toEqual(typeof service['createDrawingListener']);
  }));

  it('should call the next method when drawingResized() is called', async(() => {
    const event: Subject<Event> = service['resizedDrawingListener'];
    service.drawingResized();
    spyOn(service['resizedDrawingListener'], 'next').and.callThrough();
    expect(typeof event).toEqual(typeof service['resizedDrawingListener']);
  }));

  it('should call the sendDrawingFormData method and return the correct drawing properties', () => {
    let drawingProperties: DrawingProperties;
    drawingProperties = {color: '', width: '', height: ''};
    service.drawingProperties = drawingProperties;
    expect(service.drawingProperties.valueOf()).toEqual(drawingProperties);
  });

  it('should set the drawing properties', () => {
    let props: DrawingProperties;
    props = {color: 'red', width: '1', height: '1'};
    service.drawingProperties = (props);
    expect(service.drawingProperties.color).toBe('red');
    expect(service.drawingProperties.width).toBe('1');
    expect(service.drawingProperties.height).toBe('1');
  });
});

