import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, 
        filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { ISearchUsersResponse } from 'src/app/interfaces/search-users-response.interface';
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

  public model!: ISearchModel;

  constructor(private readonly githubService: GithubService,
              private loadingService: LoadingService) { }

  public ngOnInit(): void { 
    this.modelInit();
    this.searchUsers();
  }

  private modelInit(): void {
    this.model.users = [];
    this.model.searchRes$ = this.getSearchResponse$();
    this.model.loading$ = this.loadingService.getLoading();
    this.model.pageable = new Pageable(this.USERS_PER_PAGE);
    this.model.error = false;
    this.model.searchText = '';
    this.model.searchInput = new FormControl();
    this.model.destroyed$ = new Subject();
  }

  public getSearchResponse$(): Observable<ISearchUsersResponse> {
    return this.model.searchInput.valueChanges
    .pipe(
      map((searchText: string) => {
        this.model.searchText = searchText.trim();

        if (this.model.searchText === '') {
          this.clearUsers();
          this.model.error = false;
        }
        return this.model.searchText;
      }),
      debounceTime(this.DEBOUNCE),
      distinctUntilChanged(),
      filter((searchText: string) => searchText !== ''),
      switchMap((searchText: string) => this.search()),
      takeUntil(this.model.destroyed$),
      catchError((err: HttpErrorResponse) => this.onError())
    );
  }

  private searchUsers() {
    this.model.searchRes$.subscribe({
      next: (res: ISearchUsersResponse) => this.onSearch(res),
      error: (err: HttpErrorResponse) => this.onError()
    });
  }

  public loadMore() {
    this.model.pageable.currentPage++;
    this.search().subscribe({
      next: (res: ISearchUsersResponse) => this.onLoadedMore(res),
      error: (err: HttpErrorResponse) => this.onError()
    });
  }

  public showLoadMoreBtn() {
    return !this.model.error 
            && this.model.pageable.totalItemsCount !== 0 
            && !this.model.pageable.isLastPage;
  }

  private search(): Observable<ISearchUsersResponse> {
    return this.githubService.searchUsers({ 
      login: this.model.searchText, 
      page: this.model.pageable.currentPage,
      perPage: this.model.pageable.maxPerPage 
    }).pipe(
      takeUntil(this.model.destroyed$),
      catchError((err: HttpErrorResponse) => this.onError())
    );
  }

  private clearUsers() {
    this.model.users = [];
    this.model.pageable = new Pageable(this.USERS_PER_PAGE);
  }

  private onSearch(res: ISearchUsersResponse) {
    this.model.error = res.total_count === 0 && this.model.searchText !== '';
    this.model.users = res.items;
    this.model.pageable = new Pageable(this.USERS_PER_PAGE, 1, res.total_count);
  }

  private onLoadedMore(res: ISearchUsersResponse) {
    this.model.users.push(...res.items);
    this.model.error = false;
  }

  private onError() {
    this.clearUsers();
    this.model.error = this.model.searchText !== '';
    return EMPTY;
  }
  
  public ngOnDestroy(): void {
    this.model.destroyed$.next(true);
    this.model.destroyed$.complete();
  }
}