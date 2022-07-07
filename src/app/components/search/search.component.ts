import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, 
        filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { ISearchUsersResponse } from 'src/app/interfaces/search-users-response.interface';
import { IUserShort } from 'src/app/interfaces/user-short';
import { Pageable } from 'src/app/models/pageable.model';
import { GithubService } from 'src/app/services/github.service';
import { LoadingService } from 'src/app/services/loading.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  private DEBOUNCE: number = 500;
  private USERS_PER_PAGE: number = 20;
  
  private destroyed$: Subject<boolean> = new Subject();
  public searchText: string = '';

  public searchInput = new FormControl();
  public pageable!: Pageable;
  
  public users: IUserShort[] = [];
  public error: boolean = false;

  public loading$ = this.loadingService.getLoading();

  constructor(private readonly githubService: GithubService,
              private loadingService: LoadingService) { }

  public ngOnInit(): void { 
    this.pageable = new Pageable(this.USERS_PER_PAGE);
    this.searchUsers();
  }

  public searchUsers() {
    this.searchInput.valueChanges
      .pipe(
        map((searchText: string) => {
          const text = searchText.trim();
          if (text === '') {
            this.clearUsers();
            this.error = false;
          }
          return text;
        }),
        debounceTime(this.DEBOUNCE),
        distinctUntilChanged(),
        filter((searchText: string) => searchText !== ''),
        switchMap((searchText: string) => { 
          this.searchText = searchText;

          return this.githubService.searchUsers({ 
            login: searchText, 
            page: this.pageable.currentPage,
            perPage: this.pageable.maxPerPage 
          });
        }),
        takeUntil(this.destroyed$),
        catchError((err: HttpErrorResponse) => this.onError())
      )
      .subscribe({
        next: (res: ISearchUsersResponse) => this.onSearch(res),
        error: (err: HttpErrorResponse) => this.onError()
      });
  }
  
  public loadMore() {
    this.pageable.currentPage++;
    
    this.githubService.searchUsers({ 
      login: this.searchText, 
      page: this.pageable.currentPage,
      perPage: this.pageable.maxPerPage 
    })
    .pipe(
      takeUntil(this.destroyed$),
      catchError((err: HttpErrorResponse) => this.onError())
    )
    .subscribe({
      next: (res: ISearchUsersResponse) => this.onLoadedMore(res),
      error: (err: HttpErrorResponse) => this.onError()
    });
  }

  public showLoadMoreBtn() {
    return !this.error 
            && this.pageable.totalItemsCount !== 0 
            && !this.pageable.isLastPage;
  }

  private clearUsers() {
    this.users = [];
    this.pageable = new Pageable(this.USERS_PER_PAGE);
  }

  private onSearch(res: ISearchUsersResponse) {
    this.error = res.total_count === 0;
    this.users = res.items;
    this.pageable = new Pageable(this.USERS_PER_PAGE, 1, res.total_count);
  }

  private onLoadedMore(res: ISearchUsersResponse) {
    this.users.push(...res.items);
    this.error = false;
  }

  private onError() {
    this.clearUsers();
    this.error = true;
    return EMPTY;
  }
  
  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
