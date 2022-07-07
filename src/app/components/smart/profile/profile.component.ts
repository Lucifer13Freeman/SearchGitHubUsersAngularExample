import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, 
        Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { catchError, EMPTY, map, Observable, 
        of, Subject, takeUntil } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { GithubService } from 'src/app/services/github.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import { IProfileModel } from './interfaces/profile-model.interface';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy {

  public baseUrl: string = environment.BASE_URL;

  public model$!: Observable<IProfileModel>;
  public model!: IProfileModel;

  public error: boolean = false;
  private destroyed$: Subject<boolean> = new Subject();
  
  constructor(private route: ActivatedRoute,
              private readonly changeDetector: ChangeDetectorRef,
              private readonly githubService: GithubService,
              private loadingService: LoadingService) { }

  public ngOnInit(): void {
    this.modelInit();
  }

  private modelInit(): void {

    this.route.params.subscribe({
      next: (params: Params) => {
        this.getUserData$(params['login'])
          .subscribe({
            next: (res: IUser | never[]) => {

            const user = {...res} as IUser;

            const model: IProfileModel = {
              user,
              loading$: this.loadingService.getLoading()
            }

            this.model$ = of(model).pipe(map((model: IProfileModel) => this.model = model));
            
            this.changeDetector.detectChanges();
          },
          error: (err: HttpErrorResponse) => this.onError()
        })
      },
      error: (err: HttpErrorResponse) => this.onError()
    });
  }

  private getUserData$(login: string): Observable<IUser | never[]> {

    const user$: Observable<IUser | never[]> = this.githubService.getUserByLogin(login)
      .pipe(
        takeUntil(this.destroyed$),
        catchError((err: HttpErrorResponse) => {
          this.onError(); 
          return of([]);
        })
      );
    return user$;
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private onError(): Observable<never> {
    this.error = true;
    return EMPTY;
  }
}