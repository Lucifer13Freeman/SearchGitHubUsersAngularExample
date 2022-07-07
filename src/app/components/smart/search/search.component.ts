import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, Observable, of, Subject } from 'rxjs';
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

  public searchInput: FormControl = new FormControl();
  
  public searchRes$!: Observable<ISearchUsersResponse>;
  private destroyed$: Subject<boolean> = new Subject<boolean>();
  
  public model$!: Observable<ISearchModel>;
  public model!: ISearchModel;

  constructor(private readonly githubService: GithubService,
              private loadingService: LoadingService) { }

  public ngOnInit(): void { 
    this.modelInit();
    this.searchUsers();
  }

  public modelInit(): void {
    const model: ISearchModel = {
      loading$: this.loadingService.getLoading(),
      users: [],
      pageable: new Pageable(this.USERS_PER_PAGE),
      error: false,
      searchText: '',
      searchInput: new FormControl()
    }

    this.model$ = of(model).pipe(map((model: ISearchModel) => this.model = model));
  }

  public get searchResponse$(): Observable<ISearchUsersResponse> {
    return this.searchInput.valueChanges
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
      takeUntil(this.destroyed$),
      catchError((err: HttpErrorResponse) => this.onError())
    );
  }

  private searchUsers() {
    this.searchResponse$.subscribe({
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
      takeUntil(this.destroyed$),
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
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}