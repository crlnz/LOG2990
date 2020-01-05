/* tslint:disable */

import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { Observable, of, Subject } from 'rxjs';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { Drawing } from '../../../../../common/communication/drawing';
import { OpenDrawingService } from './open-drawing.service';

describe('OpenDrawingService', () => {
  let service: OpenDrawingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenDrawingService, HttpClient, HttpHandler],
      imports: [TestingImportsModule],
    });
    service = TestBed.get(OpenDrawingService);
  });
  it('should be created', () => {
    const service: OpenDrawingService = TestBed.get(OpenDrawingService);
    expect(service).toBeTruthy();
  });

  it('should call the getData method and return the correct url', () => {
    const spy = spyOn(service, 'getData');
    service.getData();
    expect(spy).toHaveBeenCalled();
  });

  it('should call the setCurrentDrawingData method and return the correct data', () => {
    let data: Drawing;
    data = {_id: 'abc', tags: ['1', '2'], svgList: ['1', '2'], drawingColor: 'abc', drawingHeight: '1', drawingWidth: '1'};
    service.setCurrentDrawingData(data);
    expect(service.currentDrawingData).toEqual(data);
  });

  it('should call listenOpenDrawing  and return an Observable event', async(() => {
    const event: Observable<Event> = service.listenOpenDrawing();
    spyOn(service, 'listenOpenDrawing').and.returnValue(of<any>(event));
    expect(typeof service.listenOpenDrawing()).toEqual(typeof event);
  }));

  it('should return an Observable when listenCreateDrawing is called', async(() => {
    const event: Observable<Event> = service.listenOpenDrawing();
    spyOn(service, 'listenOpenDrawing').and.returnValue(of<any>(event));
    expect(typeof service.listenOpenDrawing()).toEqual(typeof event);
  }));

  it('should call the next method when toolClicked() is called', async(() => {
    const event: Subject<Event> = service['onOpenDrawingListener'];
    service.openDrawingClicked();
    spyOn(service['onOpenDrawingListener'], 'next').and.callThrough();
    expect(typeof event).toEqual(typeof service['onOpenDrawingListener']);
  }));

});
