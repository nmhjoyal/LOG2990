import { IShape } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { ToolHandlerService } from '../tool-handler/tool-handler.service';

export class SelectorService {
  selectedObjects: Set<IShape>;
  topCornerX: number;
  topCornerY: number;
  bottomCornerX: number;
  bottomCornerY: number;
  width: number;
  height: number;
  toolService: ToolHandlerService;

  constructor(toolService: ToolHandlerService) {
    this.selectedObjects = new Set<IShape>();
    this.topCornerX = 0;
    this.topCornerY = 0;
    this.bottomCornerX = 0;
    this.bottomCornerY = 0;
    this.width = 0;
    this.height = 0;
    this.toolService = toolService;
  }

  get MinWidth(): number {
    return Math.abs(this.width - this.topCornerX);
  }

  get MinHeight(): number {
    return Math.abs(this.height - this.topCornerY);
  }

  setBoxToDrawing(drawing: IShape): void {
    this.topCornerX = drawing.x;
    this.topCornerY = drawing.y;
    this.width = drawing.x + drawing.width;
    this.height = drawing.y + drawing.height;
    this.bottomCornerX = drawing.x + drawing.width;
    this.bottomCornerY = drawing.y + drawing.height;
  }

  checkForItems(isReverseSelection: boolean, previewBoxX: number, previewBoxY: number): void {
    if (!isReverseSelection) {
      this.selectedObjects.clear();
    }
    for (const drawing of this.toolService.drawings) {
      if (this.objectInBox(drawing, previewBoxX, previewBoxY)) {
        if (isReverseSelection) {
            this.selectedObjects.delete(drawing);
        } else {
          this.selectedObjects.add(drawing);
        }
        this.updateSelectorShape(drawing);
      }
    }
  }

  updateCorners(cursorX: number, initialX: number, cursorY: number, initialY: number, previewBoxX: number, previewBoxY: number): void {
    this.bottomCornerX = cursorX >= initialX ? cursorX : initialX;
    this.bottomCornerY = cursorY >= initialY ? cursorY : initialY;
    this.topCornerX = previewBoxX + this.bottomCornerX;
    this.topCornerY = previewBoxY + this.bottomCornerY;
  }

  updateSelectorShape(drawing: IShape): void {
    if (drawing.x < this.topCornerX) {
      this.topCornerX = drawing.x;
    }
    if (drawing.y < this.topCornerY) {
      this.topCornerY = drawing.y;
    }
    if (this.width < (drawing.x + drawing.width)) {
      this.width = drawing.x + drawing.width;
    }
    if (this.height < (drawing.y + drawing.height)) {
      this.height = drawing.y + drawing.height;
    }
  }

  recalculateShape(windowWidth: number, windowHeight: number): void {
    this.topCornerX = windowWidth;
    this.topCornerY = windowHeight;
    this.width = 0;
    this.height = 0;
    for (const object of this.selectedObjects) {
      this.updateSelectorShape(object);
    }
  }

  resetSize(): void {
    this.width = 0;
    this.height = 0;
  }

  resetSelection(): void {
    this.selectedObjects.clear();
    this.resetSize();
    this.topCornerX = 0;
    this.topCornerY = 0;
    this.toolService.selection.x = 0;
    this.toolService.selection.y = 0;
    this.toolService.selection.width = 0;
    this.toolService.selection.height = 0;
  }

  saveSelection(shape: IShape): void {
    this.toolService.selection = { x: shape.x, y: shape.y, width: shape.width, height: shape.height,
      primaryColor: 'black', secondaryColor: 'black', fillOpacity: 0,
      strokeOpacity: 1, strokeWidth: 1, id: ToolConstants.TOOL_ID.SELECTOR };
  }

  selectionExists(): boolean {
    return (this.toolService.selection.width > 0 && this.toolService.selection.height > 0);
  }

  cursorTouchesObject(object: IShape, positionX: number, positionY: number): boolean {
    return (object.x <= positionX && object.y <= positionY && (object.x + object.width) >= positionX &&
            (object.y + object.height) >= positionY);
  }

  objectInBox(object: IShape, topX: number, topY: number): boolean {
    return (((object.x <= this.bottomCornerX && (object.x + object.width) >= this.bottomCornerX) ||
    (object.x + object.width) <= this.bottomCornerX) && ((object.y <= this.bottomCornerY &&
    (object.y + object.height) >= this.bottomCornerY) || (object.y + object.height) <= this.bottomCornerY))
    && (((object.x >= topX && (object.x + object.width) <= topX) || (object.x + object.width) >= topX)
    && ((object.y >= topY && (object.y + object.height) <= topY) || (object.y + object.height) >= topY));
  }
}
