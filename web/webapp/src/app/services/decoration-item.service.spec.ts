import { TestBed } from '@angular/core/testing';

import { DecorationItemService } from './decoration-item.service';

describe('DecorationItemService', () => {
  let service: DecorationItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecorationItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
