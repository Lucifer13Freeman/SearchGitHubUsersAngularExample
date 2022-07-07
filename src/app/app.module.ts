import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProfileComponent } from './components/smart/profile/profile.component';
import { ErrorComponent } from './components/dumb/error/error.component';
import { SearchComponent } from './components/smart/search/search.component';
import { NotFoundComponent } from './components/dumb/not-found/not-found.component';
import { GithubService } from './services/github.service';
import { ReposComponent } from './components/dumb/repos/repos.component';
import { UserItemComponent } from './components/dumb/user-item/user-item.component';
import { LoaderComponent } from './components/dumb/loader/loader.component';
import { LoadingService } from './services/loading.service';
import { LoadingInterceptor } from './interceptors/loading.interceptor';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
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
