import { Observable } from "rxjs";
import { IRepo } from "src/app/interfaces/repo.interface";
import { IUserShort } from "src/app/interfaces/user-short";
import { Pageable } from "src/app/models/pageable.model";

export interface IProfileDetailsModel {
    followers: IUserShort[];
    repos: IRepo[];
    following: IUserShort[];

    followersPageable: Pageable;
    reposPageable: Pageable;
    followingPageable: Pageable;

    loading$: Observable<boolean>;
}