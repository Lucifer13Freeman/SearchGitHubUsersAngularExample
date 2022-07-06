import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnInit {

  constructor() { }

  public ngOnInit(): void {}
}
