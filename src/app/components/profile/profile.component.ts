import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, forkJoin, mergeMap, Subscription } from 'rxjs';
import { Repo } from 'src/app/models/repo.model';
import { User } from 'src/app/models/user.model';
import { GithubService } from 'src/app/services/github.service';
import { UsersService } from 'src/app/services/users.service';

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
  followersSubs?: Subscription;
  reposSubs?: Subscription;

  followers: User[] = [];
  repos: Repo[] = [];
  
  constructor(private route: ActivatedRoute,
              private readonly githubService: GithubService,
              private readonly usersService: UsersService) { }

  ngOnInit(): void 
  { 
    this.route.params.subscribe(params => {
      const username = params['name'];
      this.getProfile(username);
    });
  }

  getProfile(name: string)
  {
    this.profileSubs = this.githubService.getUser(name).pipe(
      mergeMap(user => {
        this.user = user;

        const followers = this.githubService.getFollowersByUser(name);
        const repos = this.githubService.getReposByUser(name);

        return forkJoin({ followers, repos });
      }),
      catchError(err => this.onError()),
    )
    .subscribe(
    {
      next: res => {
        this.followers = res.followers;
        this.usersService.setUsers(this.followers);
        this.repos = res.repos;
      },
      error: err => this.onError()
    });
  }

  ngOnDestroy(): void
  {
    this.profileSubs?.unsubscribe();
    this.followersSubs?.unsubscribe();
  }

  clearUsers()
  {
    this.followers = [];
    this.usersService.clearUsers();
  }

  onError()
  {
    this.clearUsers();
    this.error = true;
    return EMPTY;
  }
}