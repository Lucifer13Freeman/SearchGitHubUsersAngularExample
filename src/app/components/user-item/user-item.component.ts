import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserItem } from 'src/app/interfaces/user-item.interface';


@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserItemComponent implements OnInit {

  @Input()
  public user!: IUserItem;

  constructor(private readonly router: Router) { }

  public ngOnInit(): void { }

  public goToProfile(login: string) {
    this.router.navigate(['/profile', login]);
  }
}
