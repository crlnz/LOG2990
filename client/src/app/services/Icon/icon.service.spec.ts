/* tslint:disable */

import { async, inject, TestBed } from '@angular/core/testing';
import { Observable, of, Subject } from 'rxjs';
import { Icon } from 'src/app/components/toolbar/icon';
import { IconService } from './icon.service';

describe('IconService', () => {
  let service: IconService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IconService],
    });
    service = TestBed.get(IconService);
  });

  it('should ...', inject([IconService], (service: IconService) => {
    expect(service).toBeTruthy();
  }));

  it('should call the sendHeight method and return the correct height', () => {
    const height = '10';
    service.setInitialDimensions(height, '');
    expect(service.height.valueOf()).toEqual(height);
  });

  it('should call the sendwidth method and return the correct width', () => {
    const width = '10';
    service.setInitialDimensions('', width);
    expect(service.width.valueOf()).toEqual(width);
  });

  it('should return an Observable event', async(() => {
    const event: Observable<Event> = service.listenToolClick();
    spyOn(service, 'listenToolClick').and.returnValue(of<any>(event));
    expect(typeof service.listenToolClick()).toEqual(typeof event);
  }));

  it('should change the observable when iconClicked is called', () => {
    const spy = spyOn(service, 'toolClicked');
    service.toolClicked();
    expect(spy).toHaveBeenCalled();
  });

  it('should return the icon name', () => {
    const icon: Icon = {
      name: 'testIcon',
      iconImage: 'testImage',
      hover: ''
    };
    service.icon = (icon);
    expect(service.sendIcon()).toBe('testIcon');
  });

  it('should return an Observable when listenCreateDrawing is called', async(() => {
    const event: Observable<Event> = service.listenCreateDrawing();
    spyOn(service, 'listenCreateDrawing').and.returnValue(of<any>(event));
    expect(typeof service.listenCreateDrawing()).toEqual(typeof event);
  }));

  it('should call the next method when toolClicked() is called', async(() => {
    const event: Subject<Event> = service['onToolSelectListener'];
    service.toolClicked();
    spyOn(service['onToolSelectListener'], 'next').and.callThrough();
    expect(typeof event).toEqual(typeof service['onToolSelectListener']);
  }));

  it('should call the next method when createDrawingClicked() is called', async(() => {
    const event: Subject<Event> = service['onOpenModalListener'];
    service.createDrawingClicked();
    spyOn(service['onOpenModalListener'], 'next').and.callThrough();
    expect(typeof event).toEqual(typeof service['onOpenModalListener']);
  }));
});
