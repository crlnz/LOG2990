/* tslint:disable */

import { Renderer2} from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ColorService } from '../color/color.service';
import { PipetteService } from './pipette.service';

describe('PipetteService', () => {
  let service: PipetteService;
  let event: MouseEvent;
  let renderer: jasmine.SpyObj<Renderer2>;
  let target: jasmine.SpyObj<SVGElement>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PipetteService, ColorService, Renderer2],
    });
    service = TestBed.get(PipetteService);
    renderer = jasmine.createSpyObj('Renderer2', ['setAttribute']);
    target = jasmine.createSpyObj('SVGElement', ['getAttribute', 'setAttribute']);
    renderer.setAttribute.and.callThrough();
    target.getAttribute.and.callThrough();
    target.setAttribute.and.callThrough();
    event = new MouseEvent('contextmenu', {clientX: 10, clientY: 10});
  });

  it('should be created', () => {
    const service: PipetteService = TestBed.get(PipetteService);
    expect(service).toBeTruthy();
  });

  it('should call the setToolbarWidth method and return the correct width', () => {
    const width = 10;
    service.setToolbarWidth(width);
    expect(service['properties'].toolbarWidth).toEqual(width);
  });

  it('should call the setAmountScrolledX method and return the correct amountScrolledX', () => {
    const amount = 10;
    service.setAmountScrolled(amount, amount);
    expect(service['properties'].amountScrolledX).toEqual(amount);
    expect(service['properties'].amountScrolledY).toEqual(amount);
  });

  it('should adjusts the points depending of the position of the center', async(() => {
    const x: number[] = [1];
    const y: number[] = [1];
    service['properties'].ajustedPointsX = [];
    service['properties'].ajustedPointsY = [];
    service['ajustPoints'](x, y, 1);
    expect(service['properties'].ajustedPointsX).toEqual(x);
    expect(service['properties'].ajustedPointsY).toEqual(y);
  }));

  it('should find the correct center of the polygon', async(() => {
    const x: number[] = [1];
    const y: number[] = [1];
    service['findPolygonCenter'](x, y);
    expect(service['properties'].centerX).toEqual(x[0]);
    expect(service['properties'].centerY).toEqual(y[0]);
  }));

});
