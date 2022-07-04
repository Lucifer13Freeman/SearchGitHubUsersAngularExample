import { Component, Input, OnInit } from '@angular/core';
import { Repo } from 'src/app/models/repo.model';

@Component(
{
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.scss']
})
export class ReposComponent implements OnInit 
{
  @Input()
  repos!: Repo[];

  constructor() { }

  ngOnInit(): void { }
}
