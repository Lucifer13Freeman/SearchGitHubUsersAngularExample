import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingInterceptor } from 'src/app/interceptors/loading.interceptor';
import { GithubService } from 'src/app/services/github.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SearchComponent } from './search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  const testText = 'Lucifer13Freeman';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [ 
        SearchComponent 
      ],
      providers: [
        GithubService,
        LoadingService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptor,
          multi: true,
        },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('input should work', () => {
    component.searchInput.setValue(testText);
    component.searchUsers();
    expect(component.searchInput.value).toEqual(testText);
  });

  afterEach(() => {
  });
});
