import { Component, Input, HostListener } from '@angular/core';
import ClickHelper from '../../../../../helpers/click-helper/click-helper';
import { SelectorService } from '../../../../../services/selector-service/selector-service';
import { ToolHandlerService } from '../../../../../services/tool-handler/tool-handler.service';

@Component({
  selector: 'app-eraser',
  templateUrl: './eraser.component.html',
  styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent {

  constructor(private toolService: ToolHandlerService, private selectorService: SelectorService) {
  }

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    for (const drawing of this.toolService.drawings) {
      if (this.selectorService.cursorTouchesObject(drawing, ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))) {
        const drawingIndex = this.toolService.drawings.indexOf(drawing);
        this.toolService.drawings.splice(drawingIndex, 1);
      }
    }

  }

}
