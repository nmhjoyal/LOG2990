import { Component, OnInit} from '@angular/core';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { DrawingToolsAbstract } from '../drawing-tools-abstract';

@Component({
  selector: 'app-crayon',
  templateUrl: './crayon.component.html',
  styleUrls: ['./crayon.component.scss'],
})
export class CrayonComponent extends DrawingToolsAbstract implements OnInit {

  constructor(myDrawingToolService: LocalStorageService) {
    super(myDrawingToolService);
  }

  ngOnInit() {
    // empty block
  }
}
