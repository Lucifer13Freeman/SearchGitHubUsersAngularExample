import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IUserItem } from 'src/app/interfaces/user-item.interface';


@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserItemComponent {

  @Input()
  public user!: IUserItem;

  constructor(private readonly router: Router) { }

  public goToProfile(login: string) {
    this.router.navigate(['/profile', login]);
  }
}
