import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProfileComponent } from './components/profile/profile.component';
import { ErrorComponent } from './components/error/error.component';
import { SearchComponent } from './components/search/search.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { GithubService } from './services/github.service';
import { ReposComponent } from './components/repos/repos.component';
import { UserItemComponent } from './components/user-item/user-item.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoadingService } from './services/loading.service';
import { LoadingInterceptor } from './interceptors/loading.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    ErrorComponent,
    SearchComponent,
    NotFoundComponent,
    ReposComponent,
    UserItemComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, 
    HttpClientModule
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
  bootstrap: [AppComponent]
})
export class AppModule { }
