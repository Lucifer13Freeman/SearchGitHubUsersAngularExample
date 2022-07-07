import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { catchError, EMPTY, forkJoin, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { ErrorTypeEnum } from 'src/app/enums/error-type.enum';
import { LoadMoreEnum } from 'src/app/enums/load-more.enum';
import { IRepo } from 'src/app/interfaces/repo.interface';
import { IUserShort } from 'src/app/interfaces/user-short';
import { IUser } from 'src/app/interfaces/user.interface';
import { Pageable } from 'src/app/models/pageable.model';
import { GithubService } from 'src/app/services/github.service';
import { LoadingService } from 'src/app/services/loading.service';
import { IProfileDetailsErrors } from './interfaces/profile-details-errors.interface';
import { IProfileDetailsModel } from './interfaces/profile-details-model.interface';


@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {

  @Input()
  public user!: IUser;
  public model$!: Observable<IProfileDetailsModel>;
  public model!: IProfileDetailsModel;

  private FOLLOWERS_PER_PAGE = 10;
  private FOLLOWING_PER_PAGE = 10;
  private REPOS_PER_PAGE = 10;

  public followersLoading: LoadMoreEnum = LoadMoreEnum.FOLLOWERS;
  public followingLoading: LoadMoreEnum = LoadMoreEnum.FOLLOWING;
  public reposLoading: LoadMoreEnum = LoadMoreEnum.REPOS;

  public errors: IProfileDetailsErrors = this.initialErrors();
  private destroyed$: Subject<boolean> = new Subject();

  constructor(private readonly githubService: GithubService,
              private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.modelInit();
  }

  private modelInit(): void {
    
    this.getUserDetails$(this.user.login).subscribe({
      next: (res: [IUserShort[] | never[], 
                  IRepo[] | never[], 
                  IUserShort[] | never[]]) => {

        const followers = [...res[0]] as IUserShort[];
        const repos = [...res[1]] as IRepo[];
        const following = [...res[2]] as IUserShort[];

        const model: IProfileDetailsModel = {
          followers,
          repos,
          following,

          followersPageable: new Pageable(
            this.FOLLOWERS_PER_PAGE, 1, this.user.followers
          ),
          followingPageable: new Pageable(
            this.FOLLOWING_PER_PAGE, 1, this.user.following
          ),
          reposPageable: new Pageable(
            this.REPOS_PER_PAGE, 1, this.user.public_repos
          ),

          loading$: this.loadingService.getLoading()
        }

        this.model$ = of(model).pipe(map((model: IProfileDetailsModel) => this.model = model));
      },
      error: (err: HttpErrorResponse) => this.onError()
    });
  }

  private getUserDetails$(login: string): Observable<[never[] | IUserShort[], 
                                                    never[] | IRepo[], 
                                                    never[] | IUserShort[]]> {

    const followers$: Observable<IUserShort[] | never[]> = this.githubService.getFollowersByUserLogin({ 
      login, 
      page: 1,
      perPage: this.FOLLOWERS_PER_PAGE 
    }).pipe(catchError((err: HttpErrorResponse) => {
      this.onError(ErrorTypeEnum.FOLLOWERS); 
      return of([]);
    }));

    const repos$: Observable<IRepo[] | never[]> = this.githubService.getReposByUserLogin({ 
      login, 
      page: 1,
      perPage: this.REPOS_PER_PAGE 
    }).pipe(catchError((err: HttpErrorResponse) => {
      this.onError(ErrorTypeEnum.REPOS); 
      return of([]);
    }));

    const following$: Observable<IUserShort[] | never[]> = this.githubService.getFollowingByUserLogin({ 
      login, 
      page: 1,
      perPage: this.FOLLOWING_PER_PAGE 
    }).pipe(catchError((err: HttpErrorResponse) => {
      this.onError(ErrorTypeEnum.FOLLOWING); 
      return of([]);
    }));

    const getUserDataRes$ = forkJoin([ followers$, repos$, following$ ]);
    return getUserDataRes$;
  }

  private clearFollowers(): void {
    if (!this.model) {
      return;
    }
    this.model.followers = [];
    this.model.followersPageable = new Pageable(this.FOLLOWERS_PER_PAGE);
  }

  private clearFollowing(): void {
    if (!this.model) {
      return;
    }
    this.model.following = [];
    this.model.followingPageable = new Pageable(this.FOLLOWING_PER_PAGE);
  }

  private clearRepos(): void { 
    if (!this.model) {
      return;
    }
    this.model.repos = [];
    this.model.reposPageable = new Pageable(this.REPOS_PER_PAGE);
  }

  private initialErrors(): IProfileDetailsErrors {
    const errors: IProfileDetailsErrors = {
      followers: false,
      following: false,
      repos: false
    }
    return errors;
  }

  private onError(type: ErrorTypeEnum = ErrorTypeEnum.USER): Observable<never> {
    switch (type) {
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
      default: 
          break;
    }
    return EMPTY;
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

  private loadMoreFollowers(): void {
    this.githubService.getFollowersByUserLogin({ 
      login: this.user.login, 
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
      next: (followers: IUserShort[]) => this.model.followers = [
        ...this.model.followers, ...followers
      ],
      error: (err: HttpErrorResponse) => this.onError(ErrorTypeEnum.FOLLOWERS)
    });
  }

  private loadMoreFollowing(): void {
    this.githubService.getFollowingByUserLogin({ 
      login: this.user.login, 
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
      next: (following: IUserShort[]) => this.model.following = [
        ...this.model.following, ...following
      ],
      error: (err: HttpErrorResponse) => this.onError(ErrorTypeEnum.FOLLOWING)
    });
  }

  private loadMoreRepos(): void {
    this.githubService.getReposByUserLogin({ 
      login: this.user.login, 
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
    if (!this.user || !this.model) {
      return;
    }
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

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
