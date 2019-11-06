import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColorService } from 'src/app/services/color_service/color.service';
import { SelectorService } from 'src/app/services/selector-service/selector-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ClickTypes } from 'src/AppConstants/ClickTypes';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
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

  constructor(toolServiceRef: ToolHandlerService, attributesServiceRef: AttributesService, protected colorService: ColorService,
    protected selectorService: SelectorService) {
    super(toolServiceRef, attributesServiceRef, colorService);
    this.shape.strokeWidth = 1;
    this.shape.primaryColor = 'black';
    this.shape.fillOpacity = 0;
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
    const shapeOffset = this.shape.strokeWidth / NumericalValues.TWO;
    this.shape.x =  this.previewBox.x + shapeOffset;
    this.shape.y =  this.previewBox.y + shapeOffset;
    this.shape.width = this.previewBox.width > this.shape.strokeWidth ? this.previewBox.width - this.shape.strokeWidth : 0;
    this.shape.height = this.previewBox.height > this.shape.strokeWidth ? this.previewBox.height - this.shape.strokeWidth : 0;
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

  protected handleMouseDown(event: MouseEvent): void {
    if (event.button === ClickTypes.LEFT_CLICK) {
      this.isRightClick = false;
      this.isReverseSelection = false;
      this.resetComponent();
    } else if (event.button === ClickTypes.RIGHT_CLICK) {
      this.isRightClick = true;
      if (!this.toolService.selectorBoxExists()) {
        this.isReverseSelection = false;
        this.resetComponent();
      } else {
        this.isReverseSelection = true;
      }
    }
  }

  protected handleMouseMove(): void {
    if (this.mouseDown) {
      this.mouseMoved = true;
      this.selectorService.resetSize();
      this.selectorService.updateCorners(this.cursorX, this.initialX, this.cursorY, this.initialY, this.previewBox.x, this.previewBox.y);
      this.selectorService.checkForItems(this.isReverseSelection, this.toolService.drawings, this.previewBox);
      if (this.isReverseSelection) {
        this.selectorService.recalculateShape(this.windowWidth, this.windowHeight);
      }
      if (this.selectorService.SelectedObjects.size > 0) {
        this.traceBox(this.selectorService.topCornerX, this.selectorService.topCornerY,
                      this.selectorService.MinWidth, this.selectorService.MinHeight);
      } else {
        this.selectorService.resetSelectorService();
      }
    } else {
      this.mouseMoved = false;
    }
  }

  protected handleMouseUp(event: MouseEvent): void {
    // Single clicks
    if (this.mouseDown && !this.mouseMoved) {
      if (event.button === ClickTypes.LEFT_CLICK) {
        this.leftClick(event);
        this.mouseDown = false;
      } else if (event.button === ClickTypes.RIGHT_CLICK) {
        this.rightClick(event);
        this.mouseDown = false;
      } else {
        this.resetComponent();
        this.resetShape();
      }
    } else {
      // Drag & Drop
      if (this.selectorService.SelectedObjects.size > 0) {
        this.traceBox(this.selectorService.topCornerX, this.selectorService.topCornerY,
          this.selectorService.MinWidth, this.selectorService.MinHeight);
        this.resetShape();
      } else {
        this.resetComponent();
        this.resetShape();
      }
    }
  }

  protected leftClick(event: MouseEvent): void {
    for (const drawing of this.toolService.drawings) {
      if (this.selectorService.cursorTouchesObject(drawing, ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))) {
        this.selectorService.SelectedObjects.clear();
        this.selectorService.SelectedObjects.add(drawing);
        this.selectorService.setBoxToDrawing(drawing);
        this.traceBox(this.selectorService.topCornerX, this.selectorService.topCornerY,
          this.selectorService.MinWidth, this.selectorService.MinHeight);
        return;
      }
    }
    this.resetComponent();
    this.resetShape();
  }

  protected rightClick(event: MouseEvent): void {
    for (const drawing of this.toolService.drawings) {
      if (this.selectorService.cursorTouchesObject(drawing, ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))) {
        if (this.selectorService.SelectedObjects.has(drawing)) {
          this.selectorService.selectedObjects.delete(drawing);
          this.selectorService.recalculateShape(this.windowWidth, this.windowHeight);
          this.traceBox(this.selectorService.topCornerX, this.selectorService.topCornerY,
            this.selectorService.MinWidth, this.selectorService.MinHeight);
          return;
        } else if (this.toolService.selectorBoxExists()) {
          this.selectorService.selectedObjects.add(drawing);
          this.selectorService.recalculateShape(this.windowWidth, this.windowHeight);
          this.traceBox(this.selectorService.topCornerX, this.selectorService.topCornerY,
            this.selectorService.MinWidth, this.selectorService.MinHeight);
          return;
        } else {
          this.selectorService.SelectedObjects.clear();
          this.selectorService.SelectedObjects.add(drawing);
          this.selectorService.setBoxToDrawing(drawing);
          this.traceBox(this.selectorService.topCornerX, this.selectorService.topCornerY,
            this.selectorService.MinWidth, this.selectorService.MinHeight);
        }
      }
    }
  }

  protected traceBox(topX: number, topY: number, width: number, height: number): void {
    this.shape.x = topX;
    this.shape.y = topY;
    this.shape.width = width;
    this.shape.height = height;
    this.toolService.saveSelectorBox(this.shape);
  }

  protected resetComponent() {
    this.selectorService.resetSelectorService();
    this.toolService.resetSelectorBox();
  }
}
