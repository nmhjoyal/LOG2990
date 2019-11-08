import { Component, HostListener, Input } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import ClickHelper from '../../../../../helpers/click-helper/click-helper';
import { DrawingStorageService } from '../../../../../services/drawing-storage/drawing-storage.service';
import { IShape, IPreviewBox } from '../../assets/interfaces/shape-interface';
import { ITools } from '../../assets/interfaces/itools';
import { NumericalValues } from '../../../../../../AppConstants/NumericalValues'

@Component({
  selector: 'app-eraser',
  templateUrl: './eraser.component.html',
  styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent {

  @Input() windowHeight: number;
  @Input() windowWidth: number;
  size: number;
  leftClicked: boolean;
  eraser: IPreviewBox;
  defaultX = 0;
  defaultY = 460;

  constructor(public colorService: ColorService, public drawingStorage: DrawingStorageService) {
    this.size = NumericalValues.DEFAULT_ERASER_SIZE;
    this.eraser = {
      x: this.defaultX,
      y: this.defaultY,
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
    let objectIndex: number;
    for (objectIndex = this.drawingStorage.drawings.length - 1; objectIndex >= 0; objectIndex--) {
      if (ClickHelper.objectSharesBoxArea(this.drawingStorage.drawings[objectIndex], this.eraser)) {
        this.drawingStorage.drawings[objectIndex].id += 'Erased';
        break;
      }
    }
    return this.drawingStorage.drawings[objectIndex];
  }

  toggleRedOutline(): void {
    let touchedFirstObject = true;
    for (let i = this.drawingStorage.drawings.length - 1; i >= 0; i--) {
      const drawing = this.drawingStorage.drawings[i] as IShape;
      if (drawing.secondaryColor === 'red') {
        drawing.secondaryColor = this.colorService.color[1];
      }
      if (ClickHelper.objectSharesBoxArea(this.drawingStorage.drawings[i], this.eraser) && touchedFirstObject) {
        drawing.secondaryColor = 'red';
        touchedFirstObject = false;
      }
    }
  }

  @HostListener('mousedown') mouseDown(): void {
    this.leftClicked = true;
    this.eraseObject();
  }

  @HostListener('mouseup') mouseUp(): void {
    this.leftClicked = false;
  }

  @HostListener('mousemove', ['$event']) mouseMove(event: MouseEvent): void {
    this.toggleRedOutline();
    this.setEraserProperties(event);
    if (this.leftClicked) {
      this.eraseObject();
    }
  }
}
