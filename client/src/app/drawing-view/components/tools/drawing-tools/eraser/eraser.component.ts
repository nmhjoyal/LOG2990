import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import ClickHelper from '../../../../../helpers/click-helper/click-helper';
import { SelectorService } from '../../../../../services/selector-service/selector-service';
import { ToolHandlerService } from '../../../../../services/tool-handler/tool-handler.service';
import { IShape, IPreviewBox } from '../../assets/interfaces/shape-interface';
import { ITools } from '../../assets/interfaces/itools';

@Component({
  selector: 'app-eraser',
  templateUrl: './eraser.component.html',
  styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent implements OnInit {

  constructor(public toolService: ToolHandlerService, public selectorService: SelectorService, public colorService: ColorService) {
  }

  @Input() windowHeight: number;
  @Input() windowWidth: number;
  size = 10;
  leftClicked: boolean;
  eraser: IPreviewBox;

  ngOnInit() {
    this.eraser = {
      x: 0,     // Coordinates next to eraser icon on UI
      y: 460,
      width: this.size,
      height: this.size};
  }

  setEraserProperties(event: MouseEvent): void {
    this.eraser.height = this.size
    this.eraser.width = this.size;
    this.eraser.x = ClickHelper.getXPosition(event);
    this.eraser.y = ClickHelper.getYPosition(event);
  }

  eraseObject(): ITools {
    let i: number;
    for (i = this.toolService.drawings.length - 1; i >= 0; i--) {
      if (ClickHelper.objectSharesBoxArea(this.toolService.drawings[i], this.eraser)) {
        this.toolService.drawings[i].id += 'Erased';  // Canvas doesn't display objects with id containing 'Erased'
        break;
      }
    }
    return this.toolService.drawings[i];
  }

  redOutline(): void {

    // As soon as the cursor hovers on an object, this is set false to exit 'if' to prevent multiple red outlines
    let touchedFirstObject = true;
    for (let i = this.toolService.drawings.length - 1; i >= 0; i--) {
      const drawing = this.toolService.drawings[i] as IShape;
      if (drawing.secondaryColor === 'red') {
        drawing.secondaryColor = this.colorService.color[1];
      }
      if (ClickHelper.objectSharesBoxArea(this.toolService.drawings[i], this.eraser) && touchedFirstObject) {
        drawing.secondaryColor = 'red';
        touchedFirstObject = false;
      }
    }
  }

  @HostListener('mousedown') mouseDown(): void {
    this.leftClicked = true;
    console.log(this.toolService.eraserSelected);
    this.eraseObject();
  }

  @HostListener('mouseup') mouseUp(): void {
    this.leftClicked = false;
  }

  @HostListener('mousemove', ['$event']) mouseMove(event: MouseEvent): void {
    this.redOutline();
    this.setEraserProperties(event);
    if (this.leftClicked) {
      this.eraseObject();
    }
  }
}
