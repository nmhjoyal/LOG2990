import { Component, HostListener, Input } from '@angular/core';
import { NumericalValues } from '../../../../../../AppConstants/NumericalValues';
import ClickHelper from '../../../../../helpers/click-helper/click-helper';
import { ColourService } from '../../../../../services/colour_service/colour.service';
import { DrawingStorageService } from '../../../../../services/drawing-storage/drawing-storage.service';
import { IErased } from '../../assets/interfaces/erased-interface';
import { ITools } from '../../assets/interfaces/itools';
import { IPreviewBox, IShape } from '../../assets/interfaces/shape-interface';

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
  DEFAULT_X = 0;
  DEFAULT_Y = 460;
  defaultIndex = 0;
  erasedDrawing: IErased;

  constructor(public colourService: ColourService, public drawingStorage: DrawingStorageService) {
    this.size = NumericalValues.DEFAULT_ERASER_SIZE;
    this.eraser = {
      x: this.DEFAULT_X,
      y: this.DEFAULT_Y,
      width: this.size,
      height: this.size};
  }

  setEraserProperties(event: MouseEvent): void {
    this.eraser.height = this.size;
    this.eraser.width = this.size;
    this.eraser.x = ClickHelper.getXPosition(event);
    this.eraser.y = ClickHelper.getYPosition(event);
  }

  eraseObject(): ITools {
    let objectIndex: number;
    for (objectIndex = this.drawingStorage.drawings.length - 1; objectIndex >= 0; objectIndex--) {
      const drawing = this.drawingStorage.drawings[objectIndex];
        this.erasedDrawing = {
          id: drawing.id,
          index: objectIndex,
          erasedObject: drawing,
          x: this.DEFAULT_X,
          y: this.DEFAULT_Y,
          width: this.size,
          height: this.size,
        };
      if (ClickHelper.objectSharesBoxArea(drawing, this.eraser)) {
        drawing.id += 'Erased';
        (drawing as IShape).secondaryColour = this.colourService.colour[1];
        this.drawingStorage.drawings.push(this.erasedDrawing);
        return this.erasedDrawing;
      }
    }
    return this.erasedDrawing;
  }

  toggleRedOutline(): void {
    let touchedFirstObject = true;
    for (let i = this.drawingStorage.drawings.length - 1; i >= 0; i--) {
      const drawing = this.drawingStorage.drawings[i] as IShape;
      if (drawing.secondaryColour === 'red') {
        drawing.secondaryColour = this.colourService.colour[1];
      }
      if (ClickHelper.objectSharesBoxArea(this.drawingStorage.drawings[i], this.eraser) && touchedFirstObject) {
        drawing.secondaryColour = 'red';
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
