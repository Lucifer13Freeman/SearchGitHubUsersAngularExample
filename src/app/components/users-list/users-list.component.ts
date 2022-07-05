import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component(
{
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy 
{
  @Input()
  users: User[] = [];

  constructor() { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }
}
