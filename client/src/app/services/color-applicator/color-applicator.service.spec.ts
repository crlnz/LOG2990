/* tslint:disable */

import { TestBed } from '@angular/core/testing';
import { ColorService } from '../color/color.service';
import { DrawingService } from '../drawing/drawing.service';
import { ColorApplicatorService } from './color-applicator.service';

describe('ColorApplicatorService', () => {
  let service = ColorApplicatorService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorApplicatorService],
    });

    service = TestBed.get(ColorApplicatorService);
  });
  it('should be created', () => {
    const service: ColorApplicatorService = TestBed.get(ColorApplicatorService);
    expect(service).toBeTruthy();
  });

  it('should call the method onRightClick', () => {
    const event = new MouseEvent('mousedown');
    let secondaryColor = '';
    const colorService = new ColorService();
    colorService.currentSecondaryColor.subscribe((secondary: string) => secondaryColor = secondary);
    colorService.sendSecondaryColor('');
    const drawingService = new DrawingService();
    const service = new ColorApplicatorService(colorService, drawingService);
    service.onRightClick(event, true);
    expect(service['secondaryColor']).toEqual(secondaryColor);
  });

});
