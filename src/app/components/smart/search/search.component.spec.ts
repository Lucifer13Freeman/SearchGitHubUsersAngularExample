import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { testLogin } from 'src/app/test/mock-data/common.mock';
import { ReactiveFormsModule } from '@angular/forms';


describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      declarations: [ 
        SearchComponent
      ],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

  it('should render search input element', () => {
    const compiled = fixture.debugElement.nativeElement;
    const searchInput = compiled.querySelector('input[type=search]');
    expect(searchInput).toBeTruthy();
  });

  afterEach(() => {
  });
});
