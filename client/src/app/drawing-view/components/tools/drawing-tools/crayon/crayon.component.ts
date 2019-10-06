import { Component, OnInit} from '@angular/core';
import { DrawingToolsAbstract } from '../drawing-tools-abstract';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';

@Component({
  selector: 'app-crayon',
  templateUrl: './crayon.component.html',
  styleUrls: ['./crayon.component.scss'],
})
export class CrayonComponent extends DrawingToolsAbstract implements OnInit {

  constructor(myDrawingToolService: ToolHandlerService) {
    super(myDrawingToolService);
  }

  ngOnInit() {
    // empty block
  }
}
