import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, 
        Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { catchError, EMPTY, forkJoin, map, Observable, 
        of, Subject, takeUntil } from 'rxjs';
import { ErrorTypeEnum } from 'src/app/enums/error-type.enum';
import { LoadMoreEnum } from 'src/app/enums/load-more.enum';
import { IRepo } from 'src/app/interfaces/repo.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { Pageable } from 'src/app/models/pageable.model';
import { GithubService } from 'src/app/services/github.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import { IProfileErrors } from './profile-errors.interface';
import { IProfileModel } from './interfaces/profile-model.interface';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy {

  private FOLLOWERS_PER_PAGE = 10;
  private FOLLOWING_PER_PAGE = 10;
  private REPOS_PER_PAGE = 10;

  public errors: IProfileErrors = this.initialErrors();

  public followersLoading: LoadMoreEnum = LoadMoreEnum.FOLLOWERS;
  public followingLoading: LoadMoreEnum = LoadMoreEnum.FOLLOWING;
  public reposLoading: LoadMoreEnum = LoadMoreEnum.REPOS;

  public baseUrl: string = environment.BASE_URL;

  private destroyed$: Subject<boolean> = new Subject();

  public model$!: Observable<IProfileModel>;
  public model!: IProfileModel;
  
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
            next: (res: [IUser | never[],
                        IUser[] | never[], 
                        IRepo[] | never[], 
                        IUser[] | never[]]) => {

            const user = {...res[0]} as IUser;
            const followers = [...res[1]] as IUser[];
            const repos = [...res[2]] as IRepo[];
            const following = [...res[3]] as IUser[];

            const model: IProfileModel = {
              user,
              followers,
              repos,
              following,

              followersPageable: new Pageable(
                this.FOLLOWERS_PER_PAGE, 1, user.followers
              ),
              followingPageable: new Pageable(
                this.FOLLOWING_PER_PAGE, 1, user.following
              ),
              reposPageable: new Pageable(
                this.REPOS_PER_PAGE, 1, user.public_repos
              ),

              errors: {...this.initialErrors()},

              loading$: this.loadingService.getLoading()
            }

            this.model$ = of(model).pipe(map((model: IProfileModel) => this.model = model));
            
            this.changeDetector.detectChanges();
          },
          error: (err: HttpErrorResponse) => this.onError(ErrorTypeEnum.USER)
        })
      }
    });
  }

  private getUserData$(login: string): Observable<[IUser | never[], 
                                                  never[] | IUser[], 
                                                  never[] | IRepo[], 
                                                  never[] | IUser[]]> {

    const user$: Observable<IUser | never[]> = this.githubService.getUser(login)
      .pipe(catchError((err: HttpErrorResponse) => {
        this.onError(ErrorTypeEnum.USER); 
        return of([]);
    }));

    const followers$: Observable<IUser[] | never[]> = this.githubService.getFollowersByUser({ 
      login, 
      page: 1,
      perPage: this.FOLLOWERS_PER_PAGE 
    }).pipe(catchError((err: HttpErrorResponse) => {
      this.onError(ErrorTypeEnum.FOLLOWERS); 
      return of([]);
    }));

    const repos$: Observable<IRepo[] | never[]> = this.githubService.getReposByUser({ 
      login, 
      page: 1,
      perPage: this.REPOS_PER_PAGE 
    }).pipe(catchError((err: HttpErrorResponse) => {
      this.onError(ErrorTypeEnum.REPOS); 
      return of([]);
    }));

    const following$: Observable<IUser[] | never[]> = this.githubService.getFollowingByUser({ 
      login, 
      page: 1,
      perPage: this.FOLLOWING_PER_PAGE 
    }).pipe(catchError((err: HttpErrorResponse) => {
      this.onError(ErrorTypeEnum.FOLLOWING); 
      return of([]);
    }));

    const getUserDataRes$ = forkJoin([ user$, followers$, repos$, following$ ]);
    return getUserDataRes$;
  }

  private loadMoreFollowers(): void {
    this.githubService.getFollowersByUser({ 
      login: this.model.user.login, 
      page: this.model.followersPageable.currentPage,
      perPage: this.model.followersPageable.maxPerPage 
    })
    .pipe(
      takeUntil(this.destroyed$),
      catchError((err: HttpErrorResponse) => {
        this.onError(ErrorTypeEnum.FOLLOWERS); 
        return of([]);
    }))
    .subscribe({
      next: (followers: IUser[]) => this.model.followers = [
        ...this.model.followers, ...followers
      ],
      error: (err: HttpErrorResponse) => this.onError(ErrorTypeEnum.FOLLOWERS)
    });
  }

  private loadMoreFollowing(): void {
    this.githubService.getFollowingByUser({ 
      login: this.model.user.login, 
      page: this.model.followingPageable.currentPage,
      perPage: this.model.followingPageable.maxPerPage 
    })
    .pipe(
      takeUntil(this.destroyed$),
      catchError((err: HttpErrorResponse) => {
        this.onError(ErrorTypeEnum.FOLLOWING); 
        return of([]);
    }))
    .subscribe({
      next: (following: IUser[]) => this.model.following = [
        ...this.model.following, ...following
      ],
      error: (err: HttpErrorResponse) => this.onError(ErrorTypeEnum.FOLLOWING)
    });
  }

  private loadMoreRepos(): void {
    this.githubService.getReposByUser({ 
      login: this.model.user.login, 
      page: this.model.reposPageable.currentPage,
      perPage: this.model.reposPageable.maxPerPage 
    })
    .pipe(
      takeUntil(this.destroyed$),
      catchError((err: HttpErrorResponse) => {
        this.onError(ErrorTypeEnum.REPOS); 
        return of([]);
    }))
    .subscribe({
      next: (repos: IRepo[]) => this.model.repos = [
        ...this.model.repos, ...repos
      ],
      error: (err: HttpErrorResponse) => this.onError(ErrorTypeEnum.REPOS)
    });
  }

  public loadMore(type: LoadMoreEnum): void {
    switch (type) {
      case LoadMoreEnum.FOLLOWERS:
        this.model.followersPageable.currentPage++;
        this.loadMoreFollowers();
        break;
      case LoadMoreEnum.FOLLOWING:
        this.model.followingPageable.currentPage++;
        this.loadMoreFollowing();
        break;
      case LoadMoreEnum.REPOS:
        this.model.reposPageable.currentPage++;
        this.loadMoreRepos();
        break;
      default: break;
    }
  }

  public showLoadMoreBtn(type: LoadMoreEnum): boolean {
    switch (type) {
      case LoadMoreEnum.FOLLOWERS:
        return !this.errors.followers 
              && this.model.followersPageable.totalItemsCount !== 0 
              && !this.model.followersPageable.isLastPage; 
      case LoadMoreEnum.FOLLOWING:
        return !this.errors.following 
              && this.model.followingPageable.totalItemsCount !== 0 
              && !this.model.followingPageable.isLastPage; 
      case LoadMoreEnum.REPOS:
        return !this.errors.repos 
              && this.model.reposPageable.totalItemsCount !== 0 
              && !this.model.reposPageable.isLastPage; 
      default: 
        return false;
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private clearFollowers(): void {
    if (this.model) {
      this.model.followers = [];
      this.model.followersPageable = new Pageable(this.FOLLOWERS_PER_PAGE);
    }
  }

  private clearFollowing(): void {
    if (this.model) {
      this.model.following = [];
      this.model.followingPageable = new Pageable(this.FOLLOWING_PER_PAGE);
    }
  }

  private clearRepos(): void { 
    if (this.model) {
      this.model.repos = [];
      this.model.reposPageable = new Pageable(this.REPOS_PER_PAGE);
    }
  }

  private initialErrors(): IProfileErrors {
    const errors = {
      user: false,
      followers: false,
      following: false,
      repos: false
    }
    return errors;
  }

  private onError(type: ErrorTypeEnum = ErrorTypeEnum.USER): Observable<never> {
    switch (type) {
      default: 
      case ErrorTypeEnum.USER:
        this.errors.user = true;
        break;
      case ErrorTypeEnum.FOLLOWERS:
        this.errors.followers = true;
        this.clearFollowers();
        break;
      case ErrorTypeEnum.FOLLOWING:
        this.errors.following = true;
        this.clearFollowing();
        break;
      case ErrorTypeEnum.REPOS:
        this.errors.repos = true;
        this.clearRepos();
        break;
    }
    return EMPTY;
  }
}