/* tslint:disable */

import { TestBed } from '@angular/core/testing';
import { ShapeService } from './shape.service';

describe('ShapeService', () => {
  let service: ShapeService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShapeService],
    });
    service = TestBed.get(ShapeService);
  });
  it('should be created', () => {
    const service: ShapeService = TestBed.get(ShapeService);
    expect(service).toBeTruthy();
  });

  it('it should set the strokeWidth of the Shape', () => {
    const strokeWidth = 2;
    service.strokeWidth = (strokeWidth);
    expect(service.strokeWidth.valueOf()).toEqual(strokeWidth);
  });

  it('it should set the shape type of the Shape', () => {
    const shape = 'shape';
    service.shape = (shape);
    expect(service.shape.valueOf()).toEqual(shape);
  });

  it('it should set the type of the Shape', () => {
    const type = 'type';
    service.type = (type);
    expect(service.type.valueOf()).toEqual(type);
  });

  it('it should set the number of points of a polygon', () => {
    const nbPoints = 3;
    service.nbPoints = (nbPoints);
    expect(service.nbPoints.valueOf()).toEqual(nbPoints);
  });

});
