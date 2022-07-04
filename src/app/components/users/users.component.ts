import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';

@Component(
{
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy 
{
  users: User[] = [];

  subs?: Subscription;

  constructor(private readonly router: Router,
              private readonly usersService: UsersService) { }

  ngOnInit(): void 
  {
    this.subs = this.usersService.getUsers().subscribe(
    {
      next: users => this.users = users,
      error: err => console.error(err)
    });
  }

  ngOnDestroy(): void 
  {
    this.subs?.unsubscribe();
  }

  goToProfile(login: string)
  {
    // const user = this.users.filter(u => u.login === login)[0];

    // const navigationExtras: NavigationExtras = { 
    //   state: { user },
    //   // queryParams: { name: user.login },
    // };
    
    // this.router.navigate(['/profile', login], navigationExtras);

    login && this.router.navigate(['/profile', login]);
  }
}
