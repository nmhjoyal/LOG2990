import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import { SelectorService } from 'src/app/services/selector-service/selector-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ClickTypes } from 'src/AppConstants/NumericalValues';
import { ShapeAbstract } from '../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../assets/attributes/attributes.service';

@Component({
  selector: 'app-tools-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent extends ShapeAbstract implements OnInit, OnDestroy {
  protected mouseMoved: boolean;
  protected isRightClick: boolean;
  protected isReverseSelection: boolean;
  protected selectorService: SelectorService;

  constructor(toolServiceRef: ToolHandlerService, attributesServiceRef: AttributesService, protected colorService: ColorService) {
    super(toolServiceRef, attributesServiceRef, colorService);
    this.shape.strokeWidth = 1;
    this.shape.secondaryColor = 'black';
    this.shape.fillOpacity = 0;
    this.selectorService = new SelectorService(toolServiceRef);
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
      this.selectorService.resetSelection();
    } else if (event.button === ClickTypes.RIGHT_CLICK) {
      this.isRightClick = true;
      if (!this.selectorService.selectionExists()) {
        this.isReverseSelection = false;
        this.selectorService.resetSelection();
      } else {
        this.isReverseSelection = true;
      }
    }
  }

  handleMouseMove(): void {
    if (this.mouseDown) {
      this.mouseMoved = true;
      this.selectorService.resetSize();
      this.selectorService.updateCorners(this.cursorX, this.initialX, this.cursorY, this.initialY, this.previewBox.x, this.previewBox.y);
      this.selectorService.checkForItems(this.isReverseSelection, this.previewBox.x, this.previewBox.y);
      if (this.isReverseSelection) {
        this.selectorService.recalculateShape(this.windowWidth, this.windowHeight);
      }
      if (this.selectorService.selectedObjects.size > 0) {
        this.traceBox(this.selectorService.topCornerX, this.selectorService.topCornerY,
                      this.selectorService.MinWidth, this.selectorService.MinHeight);
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
        this.selectorService.resetSelection();
        this.resetShape();
      }
    } else {
      // Drag & Drop
      if (this.selectorService.selectedObjects.size > 0) {
        this.traceBox(this.selectorService.topCornerX, this.selectorService.topCornerY,
          this.selectorService.MinWidth, this.selectorService.MinHeight);
        this.resetShape();
      } else {
        this.selectorService.resetSelection();
        this.resetShape();
      }
    }
  }

  leftClick(event: MouseEvent): void {
    for (const drawing of this.toolService.drawings) {
      if (this.selectorService.cursorTouchesObject(drawing, event.offsetX, event.offsetY)) {
        this.selectorService.selectedObjects.clear();
        this.selectorService.selectedObjects.add(drawing);
        this.selectorService.setBoxToDrawing(drawing);
        this.traceBox(drawing.x, drawing.y, drawing.width, drawing.height);
        return;
      }
    }
    this.selectorService.resetSelection();
    this.resetShape();
  }

  rightClick(event: MouseEvent): void {
    for (const drawing of this.toolService.drawings) {
      if (this.selectorService.cursorTouchesObject(drawing, event.offsetX, event.offsetY)) {
        if (this.selectorService.selectedObjects.has(drawing)) {
          this.selectorService.selectedObjects.delete(drawing);
          this.selectorService.recalculateShape(this.windowWidth, this.windowHeight);
          this.traceBox(this.selectorService.topCornerX, this.selectorService.topCornerY,
            this.selectorService.MinWidth, this.selectorService.MinHeight);
          return;
        } else if (this.selectorService.selectionExists()) {
          this.selectorService.selectedObjects.add(drawing);
          this.selectorService.recalculateShape(this.windowWidth, this.windowHeight);
          this.traceBox(this.selectorService.topCornerX, this.selectorService.topCornerY,
            this.selectorService.MinWidth, this.selectorService.MinHeight);
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
    this.selectorService.saveSelection(this.shape);
  }
}
