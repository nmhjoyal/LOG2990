import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import ClickHelper from '../../../../../helpers/click-helper/click-helper';
import { SelectorService } from '../../../../../services/selector-service/selector-service';
import { ToolHandlerService } from '../../../../../services/tool-handler/tool-handler.service';
import { IShape, IPreviewBox } from '../../assets/interfaces/shape-interface';

@Component({
  selector: 'app-eraser',
  templateUrl: './eraser.component.html',
  styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent implements OnInit {

  constructor(private toolService: ToolHandlerService, private selectorService: SelectorService, private colorService: ColorService) {
  }

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  leftClicked: boolean;
  userInputSize: number;
  xCoordinate: number;
  yCoordinate: number;
  eraser: IPreviewBox;


  ngOnInit() {
    this.userInputSize = 10;
    this.eraser = {
      x: this.xCoordinate,
      y: this.yCoordinate,
      width: this.userInputSize,
      height: this.userInputSize,
    };
  }

  setEraserProperties(event: MouseEvent): void {
    this.eraser.height = this.userInputSize;
    this.eraser.width = this.userInputSize;
    this.eraser.x = ClickHelper.getXPosition(event);
    this.eraser.y = ClickHelper.getYPosition(event);
  }

  eraseObject(): void {
    for (let i = this.toolService.drawings.length - 1; i >= 0; i--) {
      const drawing = this.toolService.drawings[i];

      if (ClickHelper.objectSharesBoxArea(drawing, this.eraser)) {
        const drawingIndex = this.toolService.drawings.indexOf(drawing);
        this.toolService.drawings.splice(drawingIndex, 1);
        break;
      }
    }
  }

  redOutline(event: MouseEvent): void {

    // As soon as the cursor hovers on an object, this is set false to exit 'if' to prevent multiple red outlines
    let touchedFirstObject = true;

    for (let i = this.toolService.drawings.length - 1; i >= 0; i--) {
      const drawing = this.toolService.drawings[i] as IShape;
      if (drawing.secondaryColor === 'red') {
        drawing.secondaryColor = this.colorService.color[1];
      }

      if (this.selectorService.cursorTouchesObject(drawing, ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))
       && touchedFirstObject) {
        drawing.secondaryColor = 'red';
        touchedFirstObject = false;
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
    this.redOutline(event);
    this.setEraserProperties(event);

    if (this.leftClicked) {
      this.eraseObject();
    }
  }
}
