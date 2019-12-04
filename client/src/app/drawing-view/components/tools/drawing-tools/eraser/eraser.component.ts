import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { SaveService } from 'src/app/services/save-service/save.service';
import ClickHelper from '../../../../../helpers/click-helper/click-helper';
import { ColourService } from '../../../../../services/colour_service/colour.service';
import { DrawingStorageService } from '../../../../../services/drawing-storage/drawing-storage.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { EraserConstants } from '../../assets/constants/eraser-constants';
import { Id, ToolConstants } from '../../assets/constants/tool-constants';
import { ITools } from '../../assets/interfaces/itools';
import { IPreviewBox, IShape } from '../../assets/interfaces/shape-interface';

@Component({
  selector: 'app-eraser',
  templateUrl: './eraser.component.html',
  styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent implements OnInit, OnDestroy {

  @Input() protected windowHeight: number;
  @Input() protected windowWidth: number;
  private size: number;
  private leftClicked: boolean;
  private eraser: IPreviewBox;
  private erasedDrawing: ITools;

  constructor(public colourService: ColourService,
              public drawingStorage: DrawingStorageService,
              public attributesStorage: AttributesService,
              public saveService: SaveService) {
    this.size = ToolConstants.DEFAULT_ERASER_SIZE;
    this.eraser = {
      x: EraserConstants.DEFAULT_X,
      y: EraserConstants.DEFAULT_Y,
      width: this.size,
      height: this.size};
    this.erasedDrawing = {
      objects: [],
      indexes: [],
      id: Id.ERASER,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  ngOnInit(): void {
    if (this.attributesStorage.eraserAttributes.wasSaved) {
      this.size = this.attributesStorage.eraserAttributes.size;
    }
  }

  ngOnDestroy(): void {
    this.attributesStorage.eraserAttributes.wasSaved = true;
    this.attributesStorage.eraserAttributes.size = this.size;
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
        if (this.erasedDrawing.objects && this.erasedDrawing.indexes && !this.erasedDrawing.objects.includes(drawing)) {
          this.erasedDrawing.objects.push({...drawing});
          this.erasedDrawing.indexes.push(objectIndex);
          this.drawingStorage.drawings.splice(objectIndex, 1);
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
    if ( this.erasedDrawing.objects && this.erasedDrawing.objects.length ) {
      this.saveService.saveDrawing({...this.erasedDrawing});
    }

    this.erasedDrawing = {
      objects: [],
      indexes: [],
      id: Id.ERASER,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  @HostListener('mousemove', ['$event']) mouseMove(event: MouseEvent): void {
    this.toggleRedOutline();
    this.setEraserProperties(event);
    if (this.leftClicked) {
      this.eraseObject();
    }
  }
}
