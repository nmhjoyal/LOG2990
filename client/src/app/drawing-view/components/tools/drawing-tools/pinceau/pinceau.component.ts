import { Component, OnInit} from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ToolConstants } from '../../assets/tool-constants';
import { DrawingToolsAbstract } from '../drawing-tools-abstract';

@Component({
  selector: 'app-pinceau',
  templateUrl: './pinceau.component.html',
  styleUrls: ['./pinceau.component.scss'],
})
export class PinceauComponent extends DrawingToolsAbstract implements OnInit {

  currentFilter: string = ToolConstants.NONE;

  ngOnInit() {
    // empty block
  }

  constructor(myDrawingToolService: ToolHandlerService) {
    super(myDrawingToolService);
    this.stroke.id = ToolConstants.TOOL_ID.PAINTBRUSH;
    this.stroke.filter = this.currentFilter;

  }

  setFilter(n: number): void {
    switch (n){
      case 0:
        this.currentFilter = "none";
        break;
      case 1:
        this.currentFilter = "url(#displacementFilter)";
        break;  
      case 2:
        this.currentFilter = "url(#blurFilter)"
        break;
      default:
          this.currentFilter = "none";
          break;
    }
  }

  // Abstract&Overridden methods

}
