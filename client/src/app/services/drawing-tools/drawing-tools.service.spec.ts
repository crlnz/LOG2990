/* tslint:disable */

import { inject, TestBed } from '@angular/core/testing';
import { DrawingToolService } from './drawing-tools.service';

describe('Service: DrawingTool', () => {
  let service: DrawingToolService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawingToolService],
    });
    service = TestBed.get(DrawingToolService);
  });

  it('should ...', inject([DrawingToolService], (service: DrawingToolService) => {
    expect(service).toBeTruthy();
  }));

  it('should call strokeWidth variable and return the correct width', () => {
    const width = 2;
    service.strokeWidth = (width);
    expect(service.strokeWidth).toEqual(2);
  });

  it('should call tool variable and return the correct tool', () => {
    const tool = 'tool';
    service.sendTool(tool);
    expect(service.selectedTool).toEqual(tool);
  });

  it('should call texture variable and set a string to texture', () => {
    const texture = 'texture';
    service.texture = (texture);
    expect(service.texture).toEqual(texture);
  });

  it('should call maxTip variable and return the correct maximum pen tip', () => {
    const maxTip = 2;
    service.maxTip = (maxTip);
    expect(service.maxTip).toEqual(2);
  });

  it('should call minTip variable and return the correct minimum pen tip', () => {
    const minTip = 2;
    service.minTip = (minTip);
    expect(service.minTip).toEqual(2);
  });

  it('should call strokeWidth variable and return the correct width', () => {
    const width = 2;
    service.strokeWidth = (width);
    expect(service.strokeWidth).toEqual(2);
  });

  it('should call pattern variable and return the correct pattern', () => {
    const pattern = 'pattern';
    service.pattern = (pattern);
    expect(service.pattern).toEqual('pattern');
  });

  it('should call diameter variable and return the correct diameter', () => {
    const diameter = 2;
    service.diameter = (diameter);
    expect(service.diameter).toEqual(2);
  });

  it('should call displayPoint variable and return the correct displayPoint', () => {
    const displayPoint = true;
    service.displayPoint = (displayPoint);
    expect(service.displayPoint).toEqual(true);
  });

  it('should call junction variable and return the correct junction', () => {
    const junction = 'junction';
    service.junction = (junction);
    expect(service.junction).toEqual('junction');
  });
});
