import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, forkJoin, mergeMap, Subscription } from 'rxjs';
import { LoadMoreEnum } from 'src/app/enums/load-more.enum';
import { Pageable } from 'src/app/models/pageable.model';
import { Repo } from 'src/app/models/repo.model';
import { User } from 'src/app/models/user.model';
import { GithubService } from 'src/app/services/github.service';
import { environment } from 'src/environments/environment';

@Component(
{
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy 
{
  private FOLLOWERS_PER_PAGE = 10;
  private FOLLOWING_PER_PAGE = 10;
  private REPOS_PER_PAGE = 10;

  user!: User;
  error: boolean = false;

  profileSubs?: Subscription;

  followers: User[] = [];
  repos: Repo[] = [];
  following: User[] = [];

  followersPageable!: Pageable;
  reposPageable!: Pageable;
  followingPageable!: Pageable;

  baseUrl: string = environment.BASE_URL;

  // loadMoreEnum!: LoadMoreEnum;
  
  constructor(private route: ActivatedRoute,
              private readonly githubService: GithubService) { }

  ngOnInit(): void 
  { 
    this.route.params.subscribe(params => {
      const login = params['login'];
      this.getProfile(login);
    });

    this.initPageables();
  }

  initPageables()
  {
    this.followersPageable = new Pageable(this.FOLLOWERS_PER_PAGE);
    this.followingPageable = new Pageable(this.FOLLOWING_PER_PAGE);
    this.reposPageable = new Pageable(this.REPOS_PER_PAGE);
  }

  getProfile(login: string)
  {
    this.profileSubs = this.githubService.getUser(login).pipe(
      mergeMap(user => {
        this.user = user;

        this.followersPageable.totalItemsCount = user.followers;
        this.followingPageable.totalItemsCount = user.following;
        this.reposPageable.totalItemsCount = user.public_repos;

        const followers = this.githubService.getFollowersByUser({ 
          login, 
          page: this.followersPageable.currentPage,
          perPage: this.followersPageable.maxPerPage 
        });
        const repos = this.githubService.getReposByUser({ 
          login, 
          page: this.followersPageable.currentPage,
          perPage: this.followersPageable.maxPerPage 
        });
        const subscriptions = this.githubService.getFollowingByUser({ 
          login, 
          page: this.followersPageable.currentPage,
          perPage: this.followersPageable.maxPerPage 
        });

        return forkJoin({ followers, repos, subscriptions });
      }),
      catchError(err => this.onError()),
    )
    .subscribe(
    {
      next: res => {
        this.followers = res.followers;
        this.repos = res.repos;
        this.following = res.subscriptions;
      },
      error: err => this.onError()
    });
  }

  getFollowers()
  {
    this.githubService.getFollowersByUser({ 
      login: this.user.login, 
      page: this.followersPageable.currentPage,
      perPage: this.followersPageable.maxPerPage 
    }).subscribe({
      next: followers => this.followers = followers,
      error: err => this.onError()
    });
  }

  getFollowing()
  {
    this.githubService.getFollowingByUser({ 
      login: this.user.login, 
      page: this.followingPageable.currentPage,
      perPage: this.followingPageable.maxPerPage 
    }).subscribe({
      next: following => this.following = following,
      error: err => this.onError()
    });
  }

  getRepos()
  {
    this.githubService.getReposByUser({ 
      login: this.user.login, 
      page: this.reposPageable.currentPage,
      perPage: this.reposPageable.maxPerPage 
    }).subscribe({
      next: repos => this.repos = repos,
      error: err => this.onError()
    });
  }

  // loadMore(type: LoadMoreEnum)
  // {
  //   switch (type) 
  //   {
  //     case LoadMoreEnum.FOLLOWERS:
  //     {
  //       this.followersPageable.currentPage++;
  //       this.getFollowers();
  //       break;
  //     }
  //     case LoadMoreEnum.FOLLOWING:
  //     {
  //       this.followingPageable.currentPage++;
  //       this.getFollowing();
  //       break;
  //     }
  //     case LoadMoreEnum.REPOS:
  //     {
  //       this.reposPageable.currentPage++;
  //       this.getRepos();
  //       break;
  //     }
  //     default: break;
  //   }
  // }

  ngOnDestroy(): void
  {
    this.profileSubs?.unsubscribe();
  }

  clearFollowers()
  {
    this.followers = [];
  }

  clearFollowing()
  {
    this.following = [];
  }

  clearRepos()
  {
    this.repos = [];
  }

  onError()
  {
    this.clearFollowers();
    this.clearFollowing();
    this.clearRepos();
    this.error = true;
    return EMPTY;
  }
}