import { Component, OnInit} from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ToolConstants } from '../../assets/tool-constants';
import { DrawingToolsAbstract } from '../drawing-tools-abstract';

@Component({
  selector: 'app-crayon',
  templateUrl: './crayon.component.html',
  styleUrls: ['./crayon.component.scss'],
})
export class CrayonComponent extends DrawingToolsAbstract implements OnInit {

  constructor(myDrawingToolService: ToolHandlerService) {
    super(myDrawingToolService);
    this.stroke.id = ToolConstants.TOOL_ID.CRAYON;
  }

  ngOnInit() {
    // empty block
  }
}
