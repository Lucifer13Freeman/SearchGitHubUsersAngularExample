import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, 
        filter, map, switchMap, tap } from 'rxjs/operators';
import { Pageable } from 'src/app/models/pageable.model';
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
  private DEBOUNCE: number = 500;
  private USERS_PER_PAGE: number = 100;

  searchInput = new FormControl();

  @Output() 
  submit = new EventEmitter<string>();

  users: User[] = [];
  error: boolean = false;

  searchSubs?: Subscription;

  pageable!: Pageable;
  
  searchText: string = '';

  constructor(private readonly githubService: GithubService) { }

  ngOnInit(): void 
  { 
    this.pageable = new Pageable(this.USERS_PER_PAGE);
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
        debounceTime(this.DEBOUNCE),
        distinctUntilChanged(),
        filter((searchText: string) => searchText !== ''),
        tap((searchText: string) => this.submit.emit(searchText)),
        switchMap((searchText: string) => 
        { 
          this.searchText = searchText;

          return this.githubService.searchUsers({ 
            login: searchText, 
            page: this.pageable.currentPage,
            perPage: this.pageable.maxPerPage 
          });
        }))
        .pipe(
          catchError(err => this.onError())
        )
        .subscribe(
        {
          next: res => {
            this.users = res.items;
            this.pageable.totalItemsCount = res.total_count;
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
    this.pageable.totalItemsCount = 0;
  }

  onError()
  {
    this.clearUsers();
    this.error = true;
    return EMPTY;
  }

  loadMore()
  {
    this.pageable.currentPage++;
    
    this.searchSubs = this.githubService.searchUsers({ 
      login: this.searchText, 
      page: this.pageable.currentPage,
      perPage: this.pageable.maxPerPage 
    })
    .pipe(
      catchError(err => this.onError())
    )
    .subscribe(
    {
      next: res => {
        this.users.push(...res.items);
        this.error = false;
      },
      error: err => this.onError()
    });
  }

  showLoadMoreBtn()
  {
    return this.pageable.totalItemsCount !== 0 && this.pageable.totalItemsCount > this.users.length;
  }
}
