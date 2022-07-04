import { Repo } from "./repo.model";
import { User } from "./user.model";

export class Profile extends User 
{
    followers_arr?: User[];
    public_repos_arr?: Repo[];
}