import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ClickTypes } from 'src/AppConstants/NumericalValues';
import { ShapeAbstract } from '../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../assets/attributes/attributes.service';
import { IShape } from '../assets/interfaces/shape-interface';
import { ToolConstants } from '../assets/tool-constants';

@Component({
  selector: 'app-tools-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent extends ShapeAbstract implements OnInit, OnDestroy {
  selectedObjects: Set<IShape>;
  topCornerX: number;
  topCornerY: number;
  bottomCornerX: number;
  bottomCornerY: number;
  minWidth: number;
  minHeight: number;
  mouseMoved: boolean;
  isRightClick: boolean;
  isReverseSelection: boolean;

  constructor(toolServiceRef: ToolHandlerService, attributesServiceRef: AttributesService) {
    super(toolServiceRef, attributesServiceRef);
    this.shape.strokeWidth = 1;
    this.shape.secondaryColor = 'black';
    this.shape.fillOpacity = 0;
    this.selectedObjects = new Set<IShape>();
    this.topCornerX = 0;
    this.topCornerY = 0;
    this.bottomCornerX = 0;
    this.bottomCornerY = 0;
    this.minWidth = 0;
    this.minHeight = 0;
    this.mouseMoved = false;
  }

  ngOnInit(): void {
    // empty block
  }

  ngOnDestroy(): void {
    // empty block
  }

  protected calculateDimensions(): void {
    super.calculateDimensions();
  }

  @HostListener('click', ['$event']) onLeftClick(event: MouseEvent): void {
    event.preventDefault();
  }

  @HostListener('contextmenu', ['$event']) onRightClick(event: MouseEvent): void {
    event.preventDefault();
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.mouseMoved = false;
    this.handleMouseDown(event);
    super.onMouseDown(event);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    super.onMouseMove(event);
    this.handleMouseMove();
  }

  @HostListener('mouseup', ['$event']) onRelease(event: MouseEvent): void {
    event.preventDefault();
    this.handleMouseUp(event);
  }

  @HostListener('mouseup') onMouseUp(): void {
    // Override ShapeAbstract listener (prevents from saving shape)
    return;
  }

  handleMouseDown(event: MouseEvent): void {
    if (event.button === ClickTypes.LEFT_CLICK) {
      this.isRightClick = false;
      this.isReverseSelection = false;
      this.resetSelection();
    } else if (event.button === ClickTypes.RIGHT_CLICK) {
      this.isRightClick = true;
      if (!this.selectionExists()) {
        this.isReverseSelection = false;
        this.resetSelection();
      } else {
        this.isReverseSelection = true;
      }
    }
  }

  handleMouseMove(): void {
    if (this.mouseDown) {
      this.mouseMoved = true;
      this.resetSize();
      this.updateCorners();
      this.checkForItems();
      if (this.isReverseSelection) {
        this.recalculateShape();
      }
      if (this.selectedObjects.size > 0) {
        this.traceBox(this.topCornerX, this.topCornerY, Math.abs(this.minWidth - this.topCornerX),
        Math.abs(this.minHeight - this.topCornerY));
      }
    } else {
      this.mouseMoved = false;
    }
  }

  handleMouseUp(event: MouseEvent): void {
    // Single clicks
    if (this.mouseDown && !this.mouseMoved) {
      if (event.button === ClickTypes.LEFT_CLICK) {
        this.leftClick(event);
        this.mouseDown = false;
      } else if (event.button === ClickTypes.RIGHT_CLICK) {
        this.rightClick(event);
        this.mouseDown = false;
      } else {
        this.resetSelection();
        this.resetShape();
      }
    } else {
      // Drag & Drop
      if (this.selectedObjects.size > 0) {
        this.traceBox(this.topCornerX, this.topCornerY, Math.abs(this.minWidth - this.topCornerX),
          Math.abs(this.minHeight - this.topCornerY));
        this.resetShape();
      } else {
        this.resetSelection();
        this.resetShape();
      }
    }
  }

  updateCorners(): void {
    this.bottomCornerX = this.cursorX >= this.initialX ? this.cursorX : this.initialX;
    this.bottomCornerY = this.cursorY >= this.initialY ? this.cursorY : this.initialY;
    this.topCornerX = this.previewBox.x + this.bottomCornerX;
    this.topCornerY = this.previewBox.y + this.bottomCornerY;
  }

  checkForItems(): void {
    if (!this.isReverseSelection) {
      this.selectedObjects.clear();
    }
    for (const drawing of this.toolService.drawings) {
      if (this.objectInBox(drawing, this.previewBox.x, this.previewBox.y, this.bottomCornerX, this.bottomCornerY)) {
        if (this.isReverseSelection) {
            this.selectedObjects.delete(drawing);
        } else {
          this.selectedObjects.add(drawing);
        }
        if (drawing.x < this.topCornerX) {
          this.topCornerX = drawing.x;
        }
        if (drawing.y < this.topCornerY) {
          this.topCornerY = drawing.y;
        }
        if (this.minWidth < (drawing.x + drawing.width)) {
          this.minWidth = drawing.x + drawing.width;
        }
        if (this.minHeight < (drawing.y + drawing.height)) {
          this.minHeight = drawing.y + drawing.height;
        }
      }
    }
  }

  recalculateShape(): void {
    this.topCornerX = this.windowWidth;
    this.topCornerY = this.windowHeight;
    this.minWidth = 0;
    this.minHeight = 0;
    for (const object of this.selectedObjects) {
        if (object.x < this.topCornerX) {
          this.topCornerX = object.x;
        }
        if (object.y < this.topCornerY) {
          this.topCornerY = object.y;
        }
        if (this.minWidth < (object.x + object.width)) {
          this.minWidth = object.x + object.width;
        }
        if (this.minHeight < (object.y + object.height)) {
          this.minHeight = object.y + object.height;
        }
    }
  }

  leftClick(event: MouseEvent): void {
    for (const drawing of this.toolService.drawings) {
      if (this.cursorTouchesObject(drawing, event.offsetX, event.offsetY)) {
        this.selectedObjects.clear();
        this.selectedObjects.add(drawing);
        this.topCornerX = drawing.x;
        this.topCornerY = drawing.y;
        this.minWidth = drawing.x + drawing.width;
        this.minHeight = drawing.y + drawing.height;
        this.bottomCornerX = drawing.x + drawing.width;
        this.bottomCornerY = drawing.y + drawing.height;
        this.traceBox(drawing.x, drawing.y, drawing.width, drawing.height);
        return;
      }
    }
    this.resetSelection();
    this.resetShape();
  }

  rightClick(event: MouseEvent): void {
    for (const drawing of this.toolService.drawings) {
      if (this.cursorTouchesObject(drawing, event.offsetX, event.offsetY)) {
        if (this.selectedObjects.has(drawing)) {
          this.selectedObjects.delete(drawing);
          this.recalculateShape();
          this.traceBox(this.topCornerX, this.topCornerY, Math.abs(this.minWidth - this.topCornerX),
                        Math.abs(this.minHeight - this.topCornerY));
          return;
        } else if (this.selectionExists()) {
          this.selectedObjects.add(drawing);
          this.recalculateShape();
          this.traceBox(this.topCornerX, this.topCornerY, Math.abs(this.minWidth - this.topCornerX),
                        Math.abs(this.minHeight - this.topCornerY));
          return;
        }
      }
    }
  }

  traceBox(topX: number, topY: number, width: number, height: number): void {
    this.shape.x = topX;
    this.shape.y = topY;
    this.shape.width = width;
    this.shape.height = height;
    this.saveSelection();
  }

  resetSize(): void {
    this.minWidth = 0;
    this.minHeight = 0;
  }

  resetSelection(): void {
    this.selectedObjects.clear();
    this.topCornerX = 0;
    this.topCornerY = 0;
    this.minWidth = 0;
    this.minHeight = 0;
    this.toolService.selection.x = 0;
    this.toolService.selection.y = 0;
    this.toolService.selection.width = 0;
    this.toolService.selection.height = 0;
  }

  protected saveSelection(): void {
    this.toolService.selection = { x: this.shape.x, y: this.shape.y, width: this.shape.width, height: this.shape.height,
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

  objectInBox(object: IShape, topX: number, topY: number, bottomX: number, bottomY: number): boolean {
    return (((object.x <= bottomX && (object.x + object.width) >= bottomX) || (object.x + object.width) <= bottomX) &&
           ((object.y <= bottomY && (object.y + object.height) >= bottomY) || (object.y + object.height) <= bottomY)) &&
           (((object.x >= topX && (object.x + object.width) <= topX) || (object.x + object.width) >= topX) &&
           ((object.y >= topY && (object.y + object.height) <= topY) || (object.y + object.height) >= topY));
  }
}
