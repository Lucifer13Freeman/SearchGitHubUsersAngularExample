import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';


describe('LoadingService', () => {

  let service: LoadingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        LoadingService
      ]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show loading', (done: DoneFn) => {
    service.show();
    service.getLoading().subscribe({
        next: (isLoading: boolean) => {
            expect(isLoading).toBeTruthy();
            done();
        } 
    });
  });

  it('should hide loading', (done: DoneFn) => {
    service.show();
    service.hide();
    service.getLoading().subscribe({
        next: (isLoading: boolean) => {
            expect(isLoading).toBeFalsy();
            done();
        } 
    });
  });
});
