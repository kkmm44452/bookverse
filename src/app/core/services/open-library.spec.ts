import { TestBed } from '@angular/core/testing';

import { OpenLibrary } from './open-library';

describe('OpenLibrary', () => {
  let service: OpenLibrary;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenLibrary);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
