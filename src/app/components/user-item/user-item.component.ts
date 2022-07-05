import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserItem } from 'src/app/models/user-item.model';


@Component(
{
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit 
{
  @Input()
  user!: UserItem;

  constructor(private readonly router: Router) { }

  ngOnInit(): void { }

  goToProfile(login: string)
  {
    login && this.router.navigate(['/profile', login]);
  }
}
