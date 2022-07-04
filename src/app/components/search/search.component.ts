import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { GithubService } from 'src/app/services/github.service';
import { UsersService } from 'src/app/services/users.service';


@Component(
{
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy
{
  searchInput = new FormControl();

  @Output() 
  submit = new EventEmitter<string>();

  users: User[] = [];
  error: boolean = false;

  searchSubs?: Subscription;

  constructor(private readonly githubService: GithubService,
              private readonly usersService: UsersService) { }

  ngOnInit(): void 
  { 
    this.searchSubs = this.searchInput.valueChanges
      .pipe(
        map((searchText: string) => {
          const text = searchText.trim();
          if (text === '') this.clearUsers();
          return text;
        }),
        debounceTime(500),
        distinctUntilChanged(),
        filter((searchText: string) => searchText !== ''),
        tap((searchText: string) => this.submit.emit(searchText)),
        switchMap(searchText => this.githubService.searchUsers(searchText).pipe(
          catchError(err => this.onError())
        )),
      )
      .subscribe(
      {
        next: res => {
          this.users = res.items;
          this.usersService.setUsers(this.users);
          this.error = false;
        },
        error: err => this.onError()
      });
  }
  
  ngOnDestroy(): void 
  {
    this.searchSubs?.unsubscribe();
  }

  clearUsers()
  {
    this.users = [];
    this.usersService.clearUsers();
  }

  onError()
  {
    this.clearUsers();
    this.error = true;
    return EMPTY;
  }
}
