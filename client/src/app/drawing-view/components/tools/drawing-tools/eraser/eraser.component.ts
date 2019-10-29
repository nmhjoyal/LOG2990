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
  leftClicked: boolean;

  eraseObject(event: MouseEvent): void {
    for (let i = this.toolService.drawings.length - 1; i >= 0; i--) {
      const drawing = this.toolService.drawings[i];

      if (this.selectorService.cursorTouchesObject(drawing, ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))) {
        const drawingIndex = this.toolService.drawings.indexOf(drawing);
        this.toolService.drawings.splice(drawingIndex, 1);
        break;
      }
    }
  }

  @HostListener('mousedown', ['$event']) mouseDown(event: MouseEvent): void {
    this.leftClicked = true;
    this.eraseObject(event);
  }

  @HostListener('mouseup') mouseUp(): void {
    this.leftClicked = false;
  }

  @HostListener('mousemove', ['$event']) mouseMove(event: MouseEvent): void {
    if (this.leftClicked) {
      this.eraseObject(event);
    }
  }
}
