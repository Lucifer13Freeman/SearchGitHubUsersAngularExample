import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './components/search/search.component';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('AppComponent', () => {

  const routes: Routes = [
    { path: 'search', component: SearchComponent },
    { path: 'profile/:login', component: ProfileComponent },
    { path: '', redirectTo: '/search', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent  }
  ];

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  
  let router: Router;
  let location: Location;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent,
        SearchComponent,
        ProfileComponent,
        NotFoundComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('"/" should redirect to route "/search"', fakeAsync(() => {
    router.navigate(['']);
    tick();
    expect(location.path()).toBe('/search');
  }));
});

