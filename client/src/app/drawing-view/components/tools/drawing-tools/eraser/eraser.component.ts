import { Component } from '@angular/core';
import ClickHelper from '../../../../../helpers/click-helper/click-helper';

@Component({
  selector: 'app-eraser',
  templateUrl: './eraser.component.html',
  styleUrls: ['./eraser.component.scss']
})
export class EraserComponent {

  constructor(private clickHelper: ClickHelper) { }

}
