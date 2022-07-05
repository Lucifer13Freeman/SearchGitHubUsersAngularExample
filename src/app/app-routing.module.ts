import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './components/search/search.component';
import { User } from './models/user.model';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'profile/:name', component: ProfileComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent  }
];

@NgModule(
{
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
