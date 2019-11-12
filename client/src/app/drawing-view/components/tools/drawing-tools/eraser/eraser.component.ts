import { Component, HostListener, Input } from '@angular/core';
import ClickHelper from '../../../../../helpers/click-helper/click-helper';
import { ColourService } from '../../../../../services/colour_service/colour.service';
import { DrawingStorageService } from '../../../../../services/drawing-storage/drawing-storage.service';
import { EraserConstants } from '../../assets/constants/eraser-constants';
import { Id } from '../../assets/constants/tool-constants';
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
  erasedDrawing: ITools;

  constructor(public colourService: ColourService, public drawingStorage: DrawingStorageService) {
    this.size = EraserConstants.DEFAULT_ERASER_SIZE;
    this.eraser = {
      x: EraserConstants.DEFAULT_X,
      y: EraserConstants.DEFAULT_Y,
      width: this.size,
      height: this.size};
    this.erasedDrawing = {
      objects: [],
      id: Id.ERASER,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
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
      if (ClickHelper.objectSharesBoxArea(drawing, this.eraser)) {
        drawing.id += 'Erased';
        if (this.erasedDrawing.objects && !this.erasedDrawing.objects.includes(drawing)) {
          this.erasedDrawing.objects.push(drawing);
        }
        (drawing as IShape).secondaryColour = this.colourService.colour[1];
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

  validateSize(): void {
    if (this.size > EraserConstants.MAX_ERASER_SIZE) {
      this.size = EraserConstants.MAX_ERASER_SIZE;
    } else if (this.size < 1) {
      this.size = 1;
    }
  }

  @HostListener('mousedown') mouseDown(): void {
    this.leftClicked = true;
    this.eraseObject();
  }

  @HostListener('mouseup') mouseUp(): void {
    this.leftClicked = false;
    this.drawingStorage.drawings.push(this.erasedDrawing);
  }

  @HostListener('mousemove', ['$event']) mouseMove(event: MouseEvent): void {
    this.toggleRedOutline();
    this.setEraserProperties(event);
    if (this.leftClicked) {
      this.eraseObject();
    }
  }
}
