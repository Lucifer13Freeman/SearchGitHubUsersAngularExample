import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './components/profile/profile.component';
import { ErrorComponent } from './components/error/error.component';
import { SearchComponent } from './components/search/search.component';
import { UsersComponent } from './components/users/users.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { GithubService } from './services/github.service';
import { UsersService } from './services/users.service';
import { ProfileService } from './services/profile.service';
import { ReposComponent } from './components/repos/repos.component';


@NgModule(
{
  declarations: [
    AppComponent,
    ProfileComponent,
    ErrorComponent,
    SearchComponent,
    UsersComponent,
    NotFoundComponent,
    ReposComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, 
    HttpClientModule
  ],
  providers: [
    GithubService,
    UsersService,
    ProfileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
