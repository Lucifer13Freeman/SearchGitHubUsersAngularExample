import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, 
        filter, map, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { GithubService } from 'src/app/services/github.service';


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
  totalCount: number = 0;
  error: boolean = false;

  searchSubs?: Subscription;

  constructor(private readonly githubService: GithubService) { }

  ngOnInit(): void 
  { 
    this.searchUsers();
  }

  searchUsers()
  {
    this.searchSubs = this.searchInput.valueChanges
      .pipe(
        map((searchText: string) => {
          const text = searchText.trim();
          if (text === '') 
          {
            this.clearUsers();
            this.error = false;
          }
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
          this.totalCount = res.total_count;
          this.error = res.items.length === 0;
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
    this.totalCount = 0;
  }

  onError()
  {
    this.clearUsers();
    this.error = true;
    return EMPTY;
  }
}
