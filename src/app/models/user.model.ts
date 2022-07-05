import { IUser } from "../interfaces/user.interface";

export class User implements IUser
{
    readonly login!: string;
    readonly id!: number;
    readonly avatar_url!: string;
    readonly url!: string;
    readonly html_url!: string;
    readonly name!: string;
    readonly bio!: string;
    readonly public_repos!: number;
    readonly public_gists!: number;
    readonly followers!: number;
    readonly following!: number;
}