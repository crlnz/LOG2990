/* tslint:disable */
import { TestBed } from '@angular/core/testing';
import { ColorService } from './color.service';

describe('ColorService', () => {
  let service: ColorService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorService],
    });
    service = TestBed.get(ColorService);
  });

  it('should be created', () => {
    service = TestBed.get(ColorService);
    expect(service).toBeTruthy();
  });

  it('should change the message when sendSecondaryColor is called', () => {
    const spy = spyOn(service, 'sendSecondaryColor');
    const primary = 'primary';
    service.sendSecondaryColor(primary);
    expect(spy).toHaveBeenCalled();
  });

  it('should change the message when sendSecondaryColor is called', () => {
    const spy = spyOn(service, 'sendSecondaryColor');
    const secondary = 'secondary';
    service.sendSecondaryColor(secondary);
    expect(spy).toHaveBeenCalled();
  });

  it('should change the message when sendBackgroundColor is called', () => {
    const spy = spyOn(service, 'sendBackgroundColor');
    const message = 'message';
    service.sendBackgroundColor(message);
    expect(spy).toHaveBeenCalled();
  });
});
