import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { ResizeService } from 'src/app/services/resize-service/resize-service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { SelectorService } from 'src/app/services/selector-service/selector-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ClickTypes } from 'src/AppConstants/ClickTypes';
import { ShapeAbstract } from '../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../assets/attributes/attributes.service';
import { ControlPoints } from '../assets/constants/selector-constants';
import { ToolConstants } from '../assets/constants/tool-constants';

@Component({
  selector: 'app-tools-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent extends ShapeAbstract implements OnInit, OnDestroy {
  protected mouseMoved: boolean;
  protected selectedControlPoint: ControlPoints;
  protected isRightClick: boolean;
  protected isReverseSelection: boolean;
  protected altKeyPressed: boolean;
  protected shiftKeyPressed: boolean;

  constructor(public toolService: ToolHandlerService, public drawingStorage: DrawingStorageService,
    saveRef: SaveService, attributesServiceRef: AttributesService, protected colourService: ColourService,
    protected selectorService: SelectorService, protected resizeService: ResizeService) {
    super(saveRef, attributesServiceRef, colourService);
    this.resizeService = new ResizeService(this.selectorService);
    this.shape.strokeWidth = 1;
    this.shape.primaryColour = 'black';
    this.shape.fillOpacity = 0;
    this.mouseMoved = false;
    this.selectedControlPoint = ControlPoints.NONE;
    this.altKeyPressed = false;
    this.shiftKeyPressed = false;
  }

  ngOnInit(): void {
    // empty block
  }

  ngOnDestroy(): void {
    // empty block
  }

  protected calculateDimensions(): void {
    super.calculateDimensions();
    const shapeOffset = this.shape.strokeWidth / 2;
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
    if (this.selectedControlPoint === ControlPoints.NONE) {
      super.onMouseMove(event);
    }
    this.handleMouseMove(event);
  }

  @HostListener('mouseup', ['$event']) onRelease(event: MouseEvent): void {
    event.preventDefault();
    this.handleMouseUp(event);
  }

  @HostListener('mouseup') onMouseUp(): void {
    // Override ShapeAbstract listener (prevents from saving shape)
    return;
  }

  @HostListener('window:keydown.alt') onAltDown(): void {
    this.altKeyPressed = true;
  }

  @HostListener('window:keyup.alt') onAltUp(): void {
    this.altKeyPressed = false;
  }

  @HostListener('window:keydown.shift') onShiftDown(): void {
    this.shiftKeyPressed = true;
  }

  @HostListener('window:keyup.shift') onShiftUp(): void {
    this.shiftKeyPressed = false;
  }

  protected handleControlPoint(event: MouseEvent): void {
    switch (this.selectedControlPoint) {
      case ControlPoints.TOP_LEFT:
        this.resizeService.cursorPosition = {x: ClickHelper.getXPosition(event), y: ClickHelper.getYPosition(event)};
        if (this.altKeyPressed) {
          this.resizeService.resizeAxesFromCenter();
        } else if (this.shiftKeyPressed) {
          this.resizeService.resizeWithAspectRatio(this.selectedControlPoint);
        } else {
          this.resizeService.resizePosition();
        }
        break;
      case ControlPoints.TOP_MIDDLE:
        this.resizeService.cursorPosition = {x: ToolConstants.NULL, y: ClickHelper.getYPosition(event)};
        if (this.altKeyPressed) {
          this.resizeService.resizeAxesFromCenter();
        } else {
          this.resizeService.resizePosition();
        }
        break;
      case ControlPoints.TOP_RIGHT:
        this.resizeService.cursorPosition = {x: ClickHelper.getXPosition(event), y: ClickHelper.getYPosition(event)};
        if (this.altKeyPressed) {
          this.resizeService.resizeAxesFromCenter();
        } else if (this.shiftKeyPressed) {
          this.resizeService.resizeWithAspectRatio(this.selectedControlPoint);
        } else {
          this.resizeService.cursorPosition = {x: ClickHelper.getXPosition(event), y: ToolConstants.NULL};
          this.resizeService.resizeAxis();
          this.resizeService.cursorPosition = {x: ToolConstants.NULL, y: ClickHelper.getYPosition(event)};
          this.resizeService.resizePosition();
        }
        break;
      case ControlPoints.MIDDLE_LEFT:
        this.resizeService.cursorPosition = {x: ClickHelper.getXPosition(event), y: ToolConstants.NULL};
        if (this.altKeyPressed) {
          this.resizeService.resizeAxesFromCenter();
        } else {
          this.resizeService.resizePosition();
        }
        break;
      case ControlPoints.MIDDLE_MIDDLE:
        break;
      case ControlPoints.MIDDLE_RIGHT:
        this.resizeService.cursorPosition = {x: ClickHelper.getXPosition(event), y: ToolConstants.NULL};
        if (this.altKeyPressed) {
          this.resizeService.resizeAxesFromCenter();
        } else {
          this.resizeService.resizeAxis();
        }
        break;
      case ControlPoints.BOTTOM_LEFT:
        this.resizeService.cursorPosition = {x: ClickHelper.getXPosition(event), y: ClickHelper.getYPosition(event)};
        if (this.altKeyPressed) {
          this.resizeService.resizeAxesFromCenter();
        } else if (this.shiftKeyPressed) {
          this.resizeService.resizeWithAspectRatio(this.selectedControlPoint);
        } else {
          this.resizeService.cursorPosition = {x: ToolConstants.NULL, y: ClickHelper.getYPosition(event)};
          this.resizeService.resizeAxis();
          this.resizeService.cursorPosition = {x: ClickHelper.getXPosition(event), y: ToolConstants.NULL};
          this.resizeService.resizePosition();
        }
        break;
      case ControlPoints.BOTTOM_MIDDLE:
        this.resizeService.cursorPosition = {x: ToolConstants.NULL, y: ClickHelper.getYPosition(event)};
        if (this.altKeyPressed) {
          this.resizeService.resizeAxesFromCenter();
        } else {
          this.resizeService.resizeAxis();
        }
        break;
      case ControlPoints.BOTTOM_RIGHT:
        this.resizeService.cursorPosition = {x: ClickHelper.getXPosition(event), y: ClickHelper.getYPosition(event)};
        if (this.altKeyPressed) {
          this.resizeService.resizeAxesFromCenter();
        } else if (this.shiftKeyPressed) {
          this.resizeService.resizeWithAspectRatio(this.selectedControlPoint);
        } else {
          this.resizeService.resizeAxis();
        }
        break;
    }
    this.traceBox();
  }

  protected handleMouseDown(event: MouseEvent): void {
    if (event.button === ClickTypes.LEFT_CLICK) {
      if (this.toolService.selectorBoxExists()) {
        this.selectedControlPoint = ClickHelper.cursorTouchesControlPoint(this.selectorService.selectorBox,
          ClickHelper.getXPosition(event), ClickHelper.getYPosition(event));
        return;
      }
      this.selectedControlPoint = ControlPoints.NONE;
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

  protected handleMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      this.mouseMoved = true;
      if (this.selectedControlPoint !== ControlPoints.NONE) {
        this.handleControlPoint(event);
        return;
      }
      this.selectorService.resetSize();
      this.selectorService.updateCorners(this.cursorX, this.initialX, this.cursorY, this.initialY, this.previewBox.x, this.previewBox.y);
      this.selectorService.checkForItems(this.isReverseSelection, this.drawingStorage.drawings, this.previewBox);
      if (this.isReverseSelection) {
        this.selectorService.recalculateShape(this.windowWidth, this.windowHeight);
      }
      if (this.selectorService.SelectedObjects.size > 0) {
        this.traceBox();
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
        this.resetComponent();
        this.leftClick(event);
        this.mouseDown = false;
      } else if (event.button === ClickTypes.RIGHT_CLICK) {
        this.rightClick(event);
        this.mouseDown = false;
      } else {
        this.resetComponent();
        this.resetShape();
      }
    } else if (this.selectedControlPoint === ControlPoints.NONE) {
      // Drag & Drop
      if (this.selectorService.SelectedObjects.size > 0) {
        this.traceBox();
        this.resetShape();
      } else {
        this.resetComponent();
        this.resetShape();
      }
    } else {
      this.resetShape();
    }
  }

  protected leftClick(event: MouseEvent): void {
    for (const drawing of this.drawingStorage.drawings) {
      if (this.selectorService.cursorTouchesObject(drawing, ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))) {
        this.selectorService.SelectedObjects.clear();
        this.selectorService.SelectedObjects.add(drawing);
        this.selectorService.setBoxToDrawing(drawing);
        this.traceBox();
        return;
      }
    }
    this.resetComponent();
    this.resetShape();
  }

  protected rightClick(event: MouseEvent): void {
    for (const drawing of this.drawingStorage.drawings) {
      if (this.selectorService.cursorTouchesObject(drawing, ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))) {
        if (this.selectorService.SelectedObjects.has(drawing)) {
          this.selectorService.selectedObjects.delete(drawing);
          this.selectorService.recalculateShape(this.windowWidth, this.windowHeight);
          this.traceBox();
          return;
        } else if (this.toolService.selectorBoxExists()) {
          this.selectorService.selectedObjects.add(drawing);
          this.selectorService.recalculateShape(this.windowWidth, this.windowHeight);
          this.traceBox();
          return;
        } else {
          this.selectorService.SelectedObjects.clear();
          this.selectorService.SelectedObjects.add(drawing);
          this.selectorService.setBoxToDrawing(drawing);
          this.traceBox();
        }
      }
    }
  }

  protected traceBox(): void {
    this.shape.x = this.selectorService.topCorner.x;
    this.shape.y = this.selectorService.topCorner.y;
    this.shape.width = this.selectorService.MinWidth;
    this.shape.height = this.selectorService.MinHeight;
    this.toolService.saveSelectorBox(this.shape);
  }

  protected resetComponent() {
    this.selectorService.resetSelectorService();
    this.toolService.resetSelectorBox();
  }
}
