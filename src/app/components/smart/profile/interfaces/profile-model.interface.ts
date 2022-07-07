import { Observable } from "rxjs";
import { LoadMoreEnum } from "src/app/enums/load-more.enum";
import { IRepo } from "src/app/interfaces/repo.interface";
import { IUser } from "src/app/interfaces/user.interface";
import { Pageable } from "src/app/models/pageable.model";
import { IProfileErrors } from "../profile-errors.interface";


export interface IProfileModel {
    user: IUser;

    followers: IUser[];
    repos: IRepo[];
    following: IUser[];

    followersPageable: Pageable;
    reposPageable: Pageable;
    followingPageable: Pageable;

    errors: IProfileErrors;

    loading$: Observable<boolean>;
}