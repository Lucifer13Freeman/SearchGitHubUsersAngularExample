import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';


@Injectable(
{
  providedIn: 'root'
})
export class UsersService 
{
    constructor() { }

    private usersSubject$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

    getUsers(): Observable<User[]>
    {
        return this.usersSubject$.asObservable();
    }

    setUsers(users: User[])
    {
        this.usersSubject$.next(users);
    }

    clearUsers()
    {
        this.usersSubject$.next([]);
    }
}
