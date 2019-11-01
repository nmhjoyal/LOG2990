import { Component, Input, HostListener } from '@angular/core';
import ClickHelper from '../../../../../helpers/click-helper/click-helper';
import { SelectorService } from '../../../../../services/selector-service/selector-service';
import { ToolHandlerService } from '../../../../../services/tool-handler/tool-handler.service';
import { IShape } from '../../assets/interfaces/shape-interface';
import { ColorService } from 'src/app/services/color_service/color.service';

@Component({
  selector: 'app-eraser',
  templateUrl: './eraser.component.html',
  styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent {

  constructor(private toolService: ToolHandlerService, private selectorService: SelectorService, private colorService: ColorService) {
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

  redOutline(event: MouseEvent): void {
    for (let i = this.toolService.drawings.length - 1; i >= 0; i--) {
      const drawing = this.toolService.drawings[i] as IShape;

      if (this.selectorService.cursorTouchesObject(drawing, ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))) {
        drawing.secondaryColor = 'red';
      } else {
        drawing.secondaryColor = this.colorService.color[1];
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
    this.redOutline(event);

    if (this.leftClicked) {
      this.eraseObject(event);
    }
  }
}
