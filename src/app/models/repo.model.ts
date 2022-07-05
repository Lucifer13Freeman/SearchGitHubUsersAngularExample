import { IRepo } from "../interfaces/repo.interface";

export class Repo implements IRepo
{
    readonly allow_forking?: boolean;
    readonly description?: string;
    readonly disabled?: false;
    readonly forks?: number;
    readonly forks_count?: number;
    readonly full_name!: string;
    readonly git_commits_url?: string;
    readonly git_refs_url?: string;
    readonly git_tags_url?: string;
    readonly git_url?: string;
    readonly html_url!: string;
    readonly id!: number;
    readonly license?: any
    readonly name!: string;
    readonly node_id?: string;
    readonly open_issues?: number;
    readonly open_issues_count?: number;
    readonly private?: false;
    readonly stargazers_count?: number;
    readonly url?: string;
    readonly visibility?: string;
    readonly watchers?: number;
    readonly watchers_count?: number;
}