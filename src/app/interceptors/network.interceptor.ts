import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';


@Injectable()
export class NetworkInterceptor implements HttpInterceptor {

  private totalRequests = 0;
  private completedRequests = 0;

  constructor(private loadingService: LoadingService) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.loadingService.show();
    this.totalRequests++;

    return next.handle(request).pipe(
      finalize(() => {

        this.completedRequests++;

        // console.log(this.completedRequests, this.totalRequests);

        if (this.completedRequests === this.totalRequests) {
          this.loadingService.hide();
          this.completedRequests = 0;
          this.totalRequests = 0;
        }
      })
    );
  }
}
