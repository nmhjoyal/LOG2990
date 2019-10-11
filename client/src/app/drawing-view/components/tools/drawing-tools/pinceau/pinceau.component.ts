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

  ngOnInit() {
    // empty block
  }

  constructor(myDrawingToolService: ToolHandlerService) {
    super(myDrawingToolService);
    this.stroke.id = ToolConstants.TOOL_ID.PAINTBRUSH;
  }

  setFilter(n: number): void {
    switch (n){
      case 0:
        this.stroke.filter = ToolConstants.NONE;
        break;
      case 1:
        this.stroke.filter = "url(#filter1)";
        break;  
      case 2:
        this.stroke.filter = "url(#filter2)"
        break;
      case 3:
        this.stroke.filter = 'url(#filter3)'
        break;
        case 4:
          this.stroke.filter = 'url(#filter4)'
          break;
      default:
          this.stroke.filter = ToolConstants.NONE;
          break;
    }
  }

  // Abstract&Overridden methods

}
