import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, 
        filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { ISearchUsersResponse } from 'src/app/interfaces/search-users-response.interface';
import { IUserShort } from 'src/app/interfaces/user-short';
import { Pageable } from 'src/app/models/pageable.model';
import { GithubService } from 'src/app/services/github.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ISearchModel } from './search.model';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  private DEBOUNCE: number = 500;
  private USERS_PER_PAGE: number = 20;

  // public model!: ISearchModel;

  public searchInput: FormControl = new FormControl();
  public searchText: string = '';

  public users: IUserShort[] = [];
  public error: boolean = false;
  public pageable: Pageable = new Pageable(this.USERS_PER_PAGE);
  
  public searchRes$!: Observable<ISearchUsersResponse>;
  private destroyed$: Subject<boolean> = new Subject<boolean>();
  public loading$: Observable<boolean> = this.loadingService.getLoading();;

  constructor(private readonly githubService: GithubService,
              private loadingService: LoadingService) { }

  public ngOnInit(): void { 
    // this.modelInit();
    this.searchRes$ = this.getSearchResponse$();
    this.searchUsers();
  }

  // private modelInit(): void {
    // this.model.users = [];
    // this.model.searchRes$ = this.getSearchResponse$();
    // this.model.loading$ = this.loadingService.getLoading();
    // this.model.pageable = new Pageable(this.USERS_PER_PAGE);
    // this.model.error = false;
    // this.model.searchText = '';
    // this.model.searchInput = new FormControl();
    // this.model.destroyed$ = new Subject<boolean>();
  // }

  public getSearchResponse$(): Observable<ISearchUsersResponse> {
    return this.searchInput.valueChanges
    .pipe(
      map((searchText: string) => {
        this.searchText = searchText.trim();

        if (this.searchText === '') {
          this.clearUsers();
          this.error = false;
        }
        return this.searchText;
      }),
      debounceTime(this.DEBOUNCE),
      distinctUntilChanged(),
      filter((searchText: string) => searchText !== ''),
      switchMap((searchText: string) => this.search()),
      takeUntil(this.destroyed$),
      catchError((err: HttpErrorResponse) => this.onError())
    );
  }

  private searchUsers() {
    this.searchRes$.subscribe({
      next: (res: ISearchUsersResponse) => this.onSearch(res),
      error: (err: HttpErrorResponse) => this.onError()
    });
  }

  public loadMore() {
    this.pageable.currentPage++;
    this.search().subscribe({
      next: (res: ISearchUsersResponse) => this.onLoadedMore(res),
      error: (err: HttpErrorResponse) => this.onError()
    });
  }

  public showLoadMoreBtn() {
    return !this.error 
            && this.pageable.totalItemsCount !== 0 
            && !this.pageable.isLastPage;
  }

  private search(): Observable<ISearchUsersResponse> {
    return this.githubService.searchUsers({ 
      login: this.searchText, 
      page: this.pageable.currentPage,
      perPage: this.pageable.maxPerPage 
    }).pipe(
      takeUntil(this.destroyed$),
      catchError((err: HttpErrorResponse) => this.onError())
    );
  }

  private clearUsers() {
    this.users = [];
    this.pageable = new Pageable(this.USERS_PER_PAGE);
  }

  private onSearch(res: ISearchUsersResponse) {
    this.error = res.total_count === 0 && this.searchText !== '';
    this.users = res.items;
    this.pageable = new Pageable(this.USERS_PER_PAGE, 1, res.total_count);
  }

  private onLoadedMore(res: ISearchUsersResponse) {
    this.users.push(...res.items);
    this.error = false;
  }

  private onError() {
    this.clearUsers();
    this.error = this.searchText !== '';
    return EMPTY;
  }
  
  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}