import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Profile } from '../models/profile.model';


@Injectable(
{
  providedIn: 'root'
})
export class ProfileService 
{
    constructor() { }

    private profileSubject$: BehaviorSubject<Profile | null> = new BehaviorSubject<Profile | null>(null);

    getProfile(): Observable<Profile | null>
    {
        return this.profileSubject$.asObservable();
    }

    setProfile(user: Profile)
    {
        this.profileSubject$.next(user);
    }

    clearProfile()
    {
        this.profileSubject$.next(null);
    }
}
