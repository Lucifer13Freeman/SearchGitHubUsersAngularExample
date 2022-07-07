import { Observable } from "rxjs";
import { IUser } from "src/app/interfaces/user.interface";

export interface IProfileModel {
    user: IUser;
    loading$: Observable<boolean>;
}