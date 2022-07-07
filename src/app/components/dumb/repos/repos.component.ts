import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IRepo } from 'src/app/interfaces/repo.interface';


@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReposComponent {

  @Input()
  public repos!: IRepo[];
}
