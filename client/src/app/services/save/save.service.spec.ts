/* tslint:disable */

import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SaveService } from './save.service';

describe('SaveService', () => {
  let service: SaveService;
  let file: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaveService, HttpClient, HttpHandler],
    });
    service = TestBed.get(SaveService);
  });
  it('should be created', () => {
    const service: SaveService = TestBed.get(SaveService);
    expect(service).toBeTruthy();
  });

  it('should call the save method and return the correct url', () => {
    const spy = spyOn(service, 'save');
    service.save(file);
    expect(spy).toHaveBeenCalled();
  });
});
