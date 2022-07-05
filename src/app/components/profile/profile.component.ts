import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, forkJoin, mergeMap, Subscription } from 'rxjs';
import { Repo } from 'src/app/models/repo.model';
import { User } from 'src/app/models/user.model';
import { GithubService } from 'src/app/services/github.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

@Component(
{
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy 
{
  user!: User;
  error: boolean = false;

  profileSubs?: Subscription;

  followers: User[] = [];
  repos: Repo[] = [];
  following: User[] = [];

  baseUrl: string = environment.BASE_URL;
  
  constructor(private route: ActivatedRoute,
              private readonly githubService: GithubService) { }

  ngOnInit(): void 
  { 
    this.route.params.subscribe(params => {
      const login = params['name'];
      this.getProfile(login);
    });
  }

  getProfile(username: string)
  {
    this.profileSubs = this.githubService.getUser(username).pipe(
      mergeMap(user => {
        this.user = user;

        const followers = this.githubService.getFollowersByUser({ login: username });
        const repos = this.githubService.getReposByUser({ login: username });
        const subscriptions = this.githubService.getFollowingByUser({ login: username });

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

  ngOnDestroy(): void
  {
    this.profileSubs?.unsubscribe();
  }

  clearFollowers()
  {
    this.followers = [];
  }

  onError()
  {
    this.clearFollowers();
    this.error = true;
    return EMPTY;
  }
}