import { Injectable } from '@angular/core';
import { ControlPoints } from 'src/app/drawing-view/components/tools/assets/constants/selector-constants';
import { Id, ToolConstants } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { IPoint } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { SelectorService } from '../selector-service/selector-service';
import ParserHelper from '../parser-service/parser.service';

@Injectable({
  providedIn: 'root',
})
export class ResizeService {

  protected cursor: IPoint;

  constructor(protected selectorService: SelectorService) {
    this.cursor = {x: 0, y: 0};
  }

  set cursorPosition(position: IPoint) {
    this.cursor = position;
  }

  protected adjustScaleAndDimensions(difference: IPoint, drawing: ITools) {
    if (drawing.scaleX && drawing.scaleY) {
      drawing.scaleX = drawing.width > 0 && drawing.scaleX * (1 + (difference.x / drawing.width)) >= 0 ?
        drawing.scaleX * (1 + (difference.x / drawing.width)) : drawing.scaleX;
      drawing.scaleY = drawing.height > 0 && drawing.scaleY * (1 + (difference.y / drawing.height)) >= 0 ?
        drawing.scaleY * (1 + (difference.y / drawing.height)) : drawing.scaleY;
    }
    drawing.width = drawing.width + difference.x >= 0 ? drawing.width + difference.x : 0;
    drawing.height = drawing.height + difference.y >= 0 ? drawing.height + difference.y : 0;
  }

  protected getBottomCornerDifference(): IPoint {
    const differenceX = this.cursor.x !== ToolConstants.NULL ? this.cursor.x - this.selectorService.bottomCorner.x : 0;
    const differenceY = this.cursor.y !== ToolConstants.NULL ? this.cursor.y - this.selectorService.bottomCorner.y : 0;
    return { x: differenceX, y: differenceY };
  }

  protected getTopCornerDifference(): IPoint {
    const differenceX = this.cursor.x !== ToolConstants.NULL ? this.selectorService.topCorner.x - this.cursor.x : 0;
    const differenceY = this.cursor.y !== ToolConstants.NULL ? this.selectorService.topCorner.y - this.cursor.y : 0;
    return { x: differenceX, y: differenceY };
  }

  protected getAspectRatioDifference(): number {
    const axisDifference = this.getBottomCornerDifference();
    const positionDifference = this.getTopCornerDifference();
    const differenceX = Math.abs(axisDifference.x) < Math.abs(positionDifference.x) ? axisDifference.x : positionDifference.x;
    const differenceY = Math.abs(axisDifference.y) < Math.abs(positionDifference.y) ? axisDifference.y : positionDifference.y;
    const difference = differenceX < 0 || differenceY < 0 ? Math.max(differenceX, differenceY) : Math.min(differenceX, differenceY);
    return difference;
  }

  protected getXYDifferences(): IPoint {
    let differenceBottom: number;
    let differenceTop: number;
    let differenceX = 0;
    let differenceY = 0;
    if (this.cursor.x !== ToolConstants.NULL) {
      differenceBottom = this.getBottomCornerDifference().x;
      differenceTop = this.getTopCornerDifference().x;
      differenceX = Math.abs(differenceBottom) < Math.abs(differenceTop) ? differenceBottom : differenceTop;
      this.selectorService.bottomCorner.x = Math.abs(differenceBottom) < Math.abs(differenceTop) ?
        this.cursor.x : this.selectorService.bottomCorner.x + differenceX;
      this.selectorService.topCorner.x = Math.abs(differenceBottom) < Math.abs(differenceTop) ?
        this.selectorService.topCorner.x - differenceX : this.cursor.x;
    }
    if (this.cursor.y !== ToolConstants.NULL) {
      differenceBottom = this.getBottomCornerDifference().y;
      differenceTop = this.getTopCornerDifference().y;
      differenceY = Math.abs(differenceBottom) < Math.abs(differenceTop) ? differenceBottom : differenceTop;
      this.selectorService.bottomCorner.y = Math.abs(differenceBottom) < Math.abs(differenceTop) ?
        this.cursor.y : this.selectorService.bottomCorner.y + differenceY;
      this.selectorService.topCorner.y = Math.abs(differenceBottom) < Math.abs(differenceTop) ?
        this.selectorService.topCorner.y - differenceY : this.cursor.y;
    }
    return { x: differenceX, y: differenceY };
  }

  resizePosition() {
    const difference: IPoint = this.getTopCornerDifference();
    for (const drawing of this.selectorService.SelectedObjects) {
      const drawingDifference: IPoint = { x: difference.x, y: difference.y};
      ParserHelper.moveObject(drawingDifference.x, drawingDifference.y, drawing);
      drawingDifference.x = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? drawingDifference.x / 2 : drawingDifference.x;
      drawingDifference.y = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? drawingDifference.y / 2 : drawingDifference.y;
      if (drawing.scaleX && drawing.scaleY) {
        drawing.scaleX = drawing.width > 0 && drawing.scaleX * (1 + (drawingDifference.x / drawing.width)) >= 0 ?
          drawing.scaleX * (1 + (drawingDifference.x / drawing.width)) : drawing.scaleX;
        drawing.scaleY = drawing.height > 0 && drawing.scaleY * (1 + (drawingDifference.y / drawing.height)) >= 0 ?
          drawing.scaleY * (1 + (drawingDifference.y / drawing.height)) : drawing.scaleY;
      }
      drawing.width = drawing.width + drawingDifference.x >= 0 && this.selectorService.topCorner.x <= drawing.x ?
        drawing.width + drawingDifference.x : 0;
      drawing.height = drawing.height + drawingDifference.y >= 0 && this.selectorService.topCorner.y <= drawing.y ?
        drawing.height + drawingDifference.y : 0;
      drawing.x = drawing.width > 0 ? drawing.x - drawingDifference.x : drawing.x;
      drawing.y = drawing.height > 0 ? drawing.y - drawingDifference.y : drawing.y;
    }
    this.selectorService.topCorner.x = this.cursor.x !== ToolConstants.NULL && this.cursor.x < this.selectorService.bottomCorner.x ?
      this.cursor.x : this.selectorService.topCorner.x;
    this.selectorService.topCorner.y = this.cursor.y !== ToolConstants.NULL && this.cursor.y < this.selectorService.bottomCorner.y ?
      this.cursor.y : this.selectorService.topCorner.y;
  }

  resizeAxis(): void {
    const difference: IPoint = this.getBottomCornerDifference();
    for (const drawing of this.selectorService.SelectedObjects) {
      const drawingDifference: IPoint = { x: difference.x, y: difference.y};
      drawingDifference.x = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? drawingDifference.x / 2 : drawingDifference.x;
      drawingDifference.y = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? drawingDifference.y / 2 : drawingDifference.y;
      if (drawing.scaleX && drawing.scaleY) {
        drawing.scaleX = drawing.width > 0 && drawing.scaleX * (1 + (drawingDifference.x / drawing.width)) >= 0 ?
          drawing.scaleX * (1 + (drawingDifference.x / drawing.width)) : drawing.scaleX;
        drawing.scaleY = drawing.height > 0 && drawing.scaleY * (1 + (drawingDifference.y / drawing.height)) >= 0 ?
          drawing.scaleY * (1 + (drawingDifference.y / drawing.height)) : drawing.scaleY;
      }
      if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
        drawing.x += drawingDifference.x;
        drawing.y += drawingDifference.y;
      }
      drawing.width = drawing.width + drawingDifference.x >= 0 && this.selectorService.bottomCorner.x >= drawing.x ?
        drawing.width + drawingDifference.x : 0;
      drawing.height = drawing.height + drawingDifference.y >= 0 && this.selectorService.bottomCorner.y >= drawing.y ?
        drawing.height + drawingDifference.y : 0;
    }
    this.selectorService.bottomCorner.x = this.cursor.x !== ToolConstants.NULL && this.cursor.x > this.selectorService.topCorner.x ?
      this.cursor.x : this.selectorService.bottomCorner.x;
    this.selectorService.bottomCorner.y = this.cursor.y !== ToolConstants.NULL && this.cursor.y > this.selectorService.topCorner.y ?
      this.cursor.y : this.selectorService.bottomCorner.y;
  }

  resizeWithAspectRatio(point: ControlPoints) {
    const difference = this.getAspectRatioDifference();
    switch (point) {
      case ControlPoints.TOP_LEFT:
        for (const drawing of this.selectorService.SelectedObjects) {
          ParserHelper.moveObject(difference, difference, drawing);
          const drawingDifference = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? difference / 2 : difference;
          drawing.x -= drawingDifference;
          drawing.y -= drawingDifference;
          this.adjustScaleAndDimensions({x: drawingDifference, y: drawingDifference}, drawing);
        }
        this.selectorService.topCorner.x -= difference;
        this.selectorService.topCorner.y -= difference;
        break;
      case ControlPoints.TOP_RIGHT:
        for (const drawing of this.selectorService.SelectedObjects) {
          ParserHelper.moveObject(0, difference, drawing);
          let drawingDifference = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? difference / 2 : difference;
          if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
            drawing.x += drawingDifference;
            drawing.y -= drawingDifference;
          } else {
            drawing.y -= drawingDifference;
          }
          drawingDifference = drawing.id === Id.POLYGON ? difference : drawingDifference;
          this.adjustScaleAndDimensions({x: drawingDifference, y: drawingDifference}, drawing);
        }
        this.selectorService.bottomCorner.x += difference;
        this.selectorService.topCorner.y -= difference;
        break;
      case ControlPoints.BOTTOM_LEFT:
        for (const drawing of this.selectorService.SelectedObjects) {
          ParserHelper.moveObject(difference, 0, drawing);
          let drawingDifference = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? difference / 2 : difference;
          if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
            drawing.x -= drawingDifference;
            drawing.y += drawingDifference;
          } else {
            drawing.x -= drawingDifference;
          }
          drawingDifference = drawing.id === Id.POLYGON ? difference : drawingDifference;
          this.adjustScaleAndDimensions({x: drawingDifference, y: drawingDifference}, drawing);
        }
        this.selectorService.topCorner.x -= difference;
        this.selectorService.bottomCorner.y += difference;
        break;
      case ControlPoints.BOTTOM_RIGHT:
        for (const drawing of this.selectorService.SelectedObjects) {
          const drawingDifference = drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON ? difference / 2 : difference;
          if (drawing.id === Id.ELLIPSE || drawing.id === Id.POLYGON) {
            drawing.y += drawingDifference;
            drawing.x += drawingDifference;
          }
          this.adjustScaleAndDimensions({x: drawingDifference, y: drawingDifference}, drawing);
        }
        this.selectorService.bottomCorner.x += difference;
        this.selectorService.bottomCorner.y += difference;
        break;
      default:
        break;
    }
  }

  resizeAxesFromCenter(): void {
    const difference: IPoint = this.getXYDifferences();
    for (const drawing of this.selectorService.SelectedObjects) {
      ParserHelper.moveObject(difference.x, difference.y, drawing);
      if (drawing.id !== Id.ELLIPSE && drawing.id !== Id.POLYGON) {
        drawing.x -= difference.x;
        drawing.y -= difference.y;
        drawing.width = drawing.width + difference.x >= 0 ? drawing.width + difference.x : 0;
        drawing.height = drawing.height + difference.y >= 0 ? drawing.height + difference.y : 0;
      }
      this.adjustScaleAndDimensions({x: difference.x, y: difference.y}, drawing);
    }
  }
}
