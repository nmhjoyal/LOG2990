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

  eraseObject(): void {
    for (let i = this.toolService.drawings.length - 1; i >= 0; i--) {
      if (this.selectorService.cursorTouchesObject(
        this.toolService.drawings[i], ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))) {
        const drawingIndex = this.toolService.drawings.indexOf(this.toolService.drawings[i]);
        this.toolService.drawings.splice(drawingIndex, 1);
        break;
      }
    }
  }

  @HostListener('mousedown', ['$event']) mouseDown(event: MouseEvent): void {
    this.leftClicked = true;
    this.eraseObject();
  }

  @HostListener('mouseup') mouseUp(): void {
    this.leftClicked = false;
  }

  @HostListener('mousemove', ['$event']) mouseMove(event: MouseEvent): void {
    if (this.leftClicked) {
      this.eraseObject();
    }
  }
}
