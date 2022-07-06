import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserItemComponent } from './user-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileComponent } from '../profile/profile.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { Router, Routes } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { IUserItem } from 'src/app/interfaces/user-item.interface';
import { Location } from '@angular/common';


describe('UserItemComponent', () => {
    let component: UserItemComponent;
    let fixture: ComponentFixture<UserItemComponent>;
    let router: Router;
    let location: Location; 

    const testUser: IUserItem = {
        id: 78305978,
        login: "Lucifer13Freeman",
        avatar_url: "https://avatars.githubusercontent.com/u/78305978?v=4",
        html_url: "https://github.com/Lucifer13Freeman",
        url: "https://api.github.com/users/Lucifer13Freeman"
    }

    const routes: Routes = [
        { path: 'search', component: SearchComponent },
        { path: 'profile/:login', component: ProfileComponent },
        { path: '', redirectTo: '/search', pathMatch: 'full' },
        { path: '**', component: NotFoundComponent  }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes(routes)
            ],
            declarations: [ 
                UserItemComponent,
                ProfileComponent,
                NotFoundComponent
            ],
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserItemComponent);
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);

        component = fixture.componentInstance;
        component.user = testUser;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    
    it('should route to user profile', fakeAsync(() => {
        component.goToProfile(testUser.login);
        tick();
        expect(location.path()).toBe('/profile/Lucifer13Freeman');
    }));
});
