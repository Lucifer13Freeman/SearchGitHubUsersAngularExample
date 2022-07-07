import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/dumb/not-found/not-found.component';
import { ProfileComponent } from './components/smart/profile/profile.component';
import { SearchComponent } from './components/smart/search/search.component';


const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'profile/:login', component: ProfileComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
