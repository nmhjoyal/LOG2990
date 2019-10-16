import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ShapeAbstract } from '../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../assets/attributes/attributes.service';
import { IShape } from '../assets/interfaces/shape-interface';

@Component({
  selector: 'app-tools-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent extends ShapeAbstract implements OnInit, OnDestroy {
  selectedObjects: IShape[];
  topCornerX: number;
  topCornerY: number;
  minWidth: number;
  minHeight: number;

  constructor(toolServiceRef: ToolHandlerService, attributesServiceRef: AttributesService) {
    super(toolServiceRef, attributesServiceRef);
    this.shape.strokeWidth = 1;
    this.shape.secondaryColor = 'black';
    this.shape.fillOpacity = 0;
    this.selectedObjects = [];
    this.topCornerX = 0;
    this.topCornerY = 0;
    this.minWidth = 0;
    this.minHeight = 0;
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

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.resetSelection();
    super.onMouseDown(event);
  }

  @HostListener('mouseup') onMouseUp(): void {
    if (this.previewBox.x === 0 && this.previewBox.y === 0 && this.previewBox.width === 0 && this.previewBox.height === 0) {
      this.resetShape();
      return;
    }
    const bottomCornerX = this.cursorX >= this.initialX ? this.cursorX : this.initialX;
    const bottomCornerY = this.cursorY >= this.initialY ? this.cursorY : this.initialY;
    this.topCornerX = this.previewBox.x + bottomCornerX;
    this.topCornerY = this.previewBox.y + bottomCornerY;

    for (const drawing of this.toolService.drawings) {
      if (drawing.x >= this.previewBox.x && drawing.y >= this.previewBox.y && (drawing.x + drawing.width) <= bottomCornerX &&
          (drawing.y + drawing.height) <= bottomCornerY) {
        this.selectedObjects.push(drawing);
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

    if (this.selectedObjects.length > 0) {
      this.shape.x = this.topCornerX;
      this.shape.y = this.topCornerY;
      this.shape.width = Math.abs(this.minWidth - this.topCornerX);
      this.shape.height = Math.abs(this.minHeight - this.topCornerY);
      this.saveSelection();
    } else {
      this.resetSelection();
      this.resetShape();
    }
  }

  resetSelection(): void {
    this.selectedObjects = [];
    this.topCornerX = 0;
    this.topCornerY = 0;
    this.minWidth = 0;
    this.minHeight = 0;
  }
}
