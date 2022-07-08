import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { from } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { testLogin } from 'src/app/test/mock-data/common.mock';


describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [ 
        ProfileComponent
     ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{ login: testLogin }]),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have route param login: "${testLogin}"`, fakeAsync(() => {
    activatedRoute.params.subscribe({
        next(value) {
            expect(value['login']).toBe(testLogin);
        },
    });
  }));
});
