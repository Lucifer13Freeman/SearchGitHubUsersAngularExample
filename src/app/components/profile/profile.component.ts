import { ChangeDetectionStrategy, ChangeDetectorRef, 
        Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, forkJoin, mergeMap, Observable, 
        of, Subject, takeUntil } from 'rxjs';
import { ErrorTypeEnum } from 'src/app/enums/error-type.enum';
import { LoadMoreEnum } from 'src/app/enums/load-more.enum';
import { IRepo } from 'src/app/interfaces/repo.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { Pageable } from 'src/app/models/pageable.model';
import { GithubService } from 'src/app/services/github.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';


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

  public user!: IUser;
  public errors = {
    user: false,
    followers: false,
    following: false,
    repos: false
  }

  public followersLoading: LoadMoreEnum = LoadMoreEnum.FOLLOWERS;
  public followingLoading: LoadMoreEnum = LoadMoreEnum.FOLLOWING;
  public reposLoading: LoadMoreEnum = LoadMoreEnum.REPOS;

  public followers: IUser[] = [];
  public repos: IRepo[] = [];
  public following: IUser[] = [];

  public followersPageable!: Pageable;
  public reposPageable!: Pageable;
  public followingPageable!: Pageable;

  public baseUrl: string = environment.BASE_URL;

  private destroyed$: Subject<boolean> = new Subject();
  public loading$ = this.loadingService.getLoading();

  
  constructor(private route: ActivatedRoute,
              private readonly changeDetector: ChangeDetectorRef,
              private readonly githubService: GithubService,
              private loadingService: LoadingService) { }

  public ngOnInit(): void { 
    this.route.params.subscribe(params => {
      const login = params['login'];
      this.getProfile(login);
    });

    this.initPageables();
  }

  private initPageables(): void {
    this.followersPageable = new Pageable(this.FOLLOWERS_PER_PAGE);
    this.followingPageable = new Pageable(this.FOLLOWING_PER_PAGE);
    this.reposPageable = new Pageable(this.REPOS_PER_PAGE);
  }

  private getProfile(login: string): void {

    this.githubService.getUser(login).pipe(
      mergeMap(user => {
        this.user = user;

        this.followersPageable.totalItemsCount = user.followers;
        this.followingPageable.totalItemsCount = user.following;
        this.reposPageable.totalItemsCount = user.public_repos;

        const followers = this.githubService.getFollowersByUser({ 
          login, 
          page: this.followersPageable.currentPage,
          perPage: this.followersPageable.maxPerPage 
        }).pipe(catchError(err => {
          this.onError(ErrorTypeEnum.FOLLOWERS); 
          return of([]);
        }));

        const repos = this.githubService.getReposByUser({ 
          login, 
          page: this.reposPageable.currentPage,
          perPage: this.reposPageable.maxPerPage 
        }).pipe(catchError(err => {
          this.onError(ErrorTypeEnum.REPOS); 
          return of([]);
        }));

        const following = this.githubService.getFollowingByUser({ 
          login, 
          page: this.followingPageable.currentPage,
          perPage: this.followingPageable.maxPerPage 
        }).pipe(catchError(err => {
          this.onError(ErrorTypeEnum.FOLLOWING); 
          return of([]);
        }));

        return forkJoin([ followers, repos, following ]);
      }),
      takeUntil(this.destroyed$),
    )
    .subscribe({
      next: res => {
        this.followers = res[0];
        this.repos = res[1];
        this.following = res[2];

        this.changeDetector.detectChanges();
      },
      error: err => this.onError()
    });
  }

  private loadMoreFollowers(): void {
    this.githubService.getFollowersByUser({ 
      login: this.user.login, 
      page: this.followersPageable.currentPage,
      perPage: this.followersPageable.maxPerPage 
    })
    .pipe(
      takeUntil(this.destroyed$),
      catchError(err => {
        this.onError(ErrorTypeEnum.FOLLOWERS); 
        return of([]);
    }))
    .subscribe({
      next: followers => this.followers = [...this.followers, ...followers],
      error: err => this.onError()
    });
  }

  private loadMoreFollowing(): void {
    this.githubService.getFollowingByUser({ 
      login: this.user.login, 
      page: this.followingPageable.currentPage,
      perPage: this.followingPageable.maxPerPage 
    })
    .pipe(
      takeUntil(this.destroyed$),
      catchError(err => {
        this.onError(ErrorTypeEnum.FOLLOWING); 
        return of([]);
    }))
    .subscribe({
      next: following => this.following = [...this.following, ...following],
      error: err => this.onError()
    });
  }

  private loadMoreRepos(): void {
    this.githubService.getReposByUser({ 
      login: this.user.login, 
      page: this.reposPageable.currentPage,
      perPage: this.reposPageable.maxPerPage 
    })
    .pipe(
      takeUntil(this.destroyed$),
      catchError(err => {
        this.onError(ErrorTypeEnum.REPOS); 
        return of([]);
    }))
    .subscribe({
      next: repos => this.repos = [...this.repos, ...repos],
      error: err => this.onError()
    });
  }

  public loadMore(type: LoadMoreEnum): void {
    switch (type) {
      case LoadMoreEnum.FOLLOWERS:
        this.followersPageable.currentPage++;
        this.loadMoreFollowers();
        break;
      case LoadMoreEnum.FOLLOWING:
        this.followingPageable.currentPage++;
        this.loadMoreFollowing();
        break;
      case LoadMoreEnum.REPOS:
        this.reposPageable.currentPage++;
        this.loadMoreRepos();
        break;
      default: break;
    }
  }

  public showLoadMoreBtn(type: LoadMoreEnum): boolean {
    switch (type) {
      case LoadMoreEnum.FOLLOWERS:
        return !this.errors.followers 
              && this.followersPageable.totalItemsCount !== 0 
              && !this.followersPageable.isLastPage; 
              //this.followersPageable.totalItemsCount > this.followers.length;
      case LoadMoreEnum.FOLLOWING:
        return !this.errors.following 
              && this.followingPageable.totalItemsCount !== 0 
              && !this.followingPageable.isLastPage; 
              //this.followingPageable.totalItemsCount > this.following.length;
      case LoadMoreEnum.REPOS:
        return !this.errors.repos 
              && this.reposPageable.totalItemsCount !== 0 
              && !this.reposPageable.isLastPage; 
              //this.reposPageable.totalItemsCount > this.repos.length;
      default: 
        return false;
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private clearFollowers(): void {
    this.followers = [];
    this.followersPageable = new Pageable(this.FOLLOWERS_PER_PAGE);
  }

  private clearFollowing(): void {
    this.following = [];
    this.followingPageable = new Pageable(this.FOLLOWING_PER_PAGE);
  }

  private clearRepos(): void { 
    this.repos = [];
    this.reposPageable = new Pageable(this.REPOS_PER_PAGE);
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