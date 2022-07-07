import { FormControl } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { ISearchUsersResponse } from "src/app/interfaces/search-users-response.interface";
import { IUserShort } from "src/app/interfaces/user-short";
import { Pageable } from "src/app/models/pageable.model";

export interface ISearchModel {
    users: IUserShort[];
    pageable: Pageable;
    error: boolean;
    loading$: Observable<boolean>;
    searchText: string;
}