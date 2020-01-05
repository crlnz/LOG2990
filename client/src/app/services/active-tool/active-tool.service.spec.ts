/* tslint:disable */

import { TestBed } from '@angular/core/testing';
import { ActiveToolService } from './active-tool.service';

describe('ActiveToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ActiveToolService],
  }));

  it('should be created', () => {
    const service: ActiveToolService = TestBed.get(ActiveToolService);
    expect(service).toBeTruthy();
  });
});
