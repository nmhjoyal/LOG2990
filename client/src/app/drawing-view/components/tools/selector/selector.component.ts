import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import RotateHelper from 'src/app/helpers/rotate-helper/rotate-helper';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DragService } from 'src/app/services/drag/drag.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { ResizeService } from 'src/app/services/resize-service/resize-service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { SelectorService } from 'src/app/services/selector-service/selector-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ClickTypes } from 'src/AppConstants/ClickTypes';
import { ShapeAbstract } from '../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../assets/attributes/attributes.service';
import { ControlPoints } from '../assets/constants/selector-constants';
import { Id, ToolConstants } from '../assets/constants/tool-constants';
import { ITools } from '../assets/interfaces/itools';

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
  protected shiftDown: boolean;
  protected angleIncrement: number;
  protected altDown: boolean;
  protected shouldDrag: boolean;
  protected dragOperation: ITools;
  protected isRotation: boolean;
  protected angleRotated: number;

  constructor(public toolService: ToolHandlerService, public drawingStorage: DrawingStorageService,
    saveRef: SaveService, attributesServiceRef: AttributesService, protected colourService: ColourService,
    protected selectorService: SelectorService, protected resizeService: ResizeService) {
    super(saveRef, attributesServiceRef, colourService);
    this.resizeService = new ResizeService(this.selectorService);
    this.shape.strokeWidth = 1;
    this.shape.primaryColour = 'black';
    this.shape.fillOpacity = 0;
    this.mouseMoved = false;
    this.shiftDown = false;
    this.angleIncrement = ToolConstants.ANGLE_INCREMENT_15;
    this.selectedControlPoint = ControlPoints.NONE;
    this.altDown = false;
    this.mouseDown = false;
    this.shouldDrag = false;
    this.dragOperation = {
      id: Id.DRAG,
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
      width: 0,
      height: 0,
      indexes: [],
    };
    this.isRotation = false;
    this.angleRotated = 0;
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
    this.shape.x = this.previewBox.x + shapeOffset;
    this.shape.y = this.previewBox.y + shapeOffset;
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
    this.shouldDrag = false;
  }

  @HostListener('mouseup') onMouseUp(): void {
    // Override ShapeAbstract listener (prevents from saving shape)
    return;
  }

  // Rotation methods

  @HostListener('window:keyup.shift') onShiftUp(): void {
    this.shiftDown = false;
  }

  @HostListener('window:keydown.shift') onShiftDown(): void {
    this.shiftDown = true;
  }

  @HostListener('window:keydown.alt', ['$event']) onAltDown(event: KeyboardEvent): void {
    event.preventDefault();
    this.altDown = true;
    this.angleIncrement = this.angleIncrement === ToolConstants.ANGLE_INCREMENT_1 ?
      ToolConstants.ANGLE_INCREMENT_15 : ToolConstants.ANGLE_INCREMENT_1;
  }

  @HostListener('window:keyup.alt', ['$event']) onAltUp(event: KeyboardEvent): void {
    event.preventDefault();
    this.altDown = false;
  }

  @HostListener('wheel', ['$event']) onWheel(event: WheelEvent): void {
    event.preventDefault();
    const rotateValue = event.deltaY > 0 ? this.angleIncrement : -this.angleIncrement;

    const x = this.selectorService.topCorner.x + (this.selectorService.MinWidth / 2);
    const y = this.selectorService.topCorner.y + (this.selectorService.MinHeight / 2);

    this.selectorService.selectedObjects.forEach((drawing) => {
            this.shiftDown ? RotateHelper.rotateOnItself(drawing, rotateValue) : RotateHelper.calculatePosition(drawing, rotateValue, x, y);

    });
    this.angleRotated += rotateValue;
    this.isRotation = this.angleRotated !== 0;
  }

  protected handleControlPoint(event: MouseEvent): void {
    switch (this.selectedControlPoint) {
      case ControlPoints.TOP_LEFT:
        this.resizeService.cursorPosition = {x: ClickHelper.getXPosition(event), y: ClickHelper.getYPosition(event)};
        if (this.altDown) {
          this.resizeService.resizeAxesFromCenter();
        } else if (this.shiftDown) {
          this.resizeService.resizeWithAspectRatio(this.selectedControlPoint);
        } else {
          this.resizeService.resizePosition();
        }
        break;
      case ControlPoints.TOP_MIDDLE:
        this.resizeService.cursorPosition = {x: ToolConstants.NULL, y: ClickHelper.getYPosition(event)};
        if (this.altDown) {
          this.resizeService.resizeAxesFromCenter();
        } else {
          this.resizeService.resizePosition();
        }
        break;
      case ControlPoints.TOP_RIGHT:
        this.resizeService.cursorPosition = {x: ClickHelper.getXPosition(event), y: ClickHelper.getYPosition(event)};
        if (this.altDown) {
          this.resizeService.resizeAxesFromCenter();
        } else if (this.shiftDown) {
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
        if (this.altDown) {
          this.resizeService.resizeAxesFromCenter();
        } else {
          this.resizeService.resizePosition();
        }
        break;
      case ControlPoints.MIDDLE_MIDDLE:
        break;
      case ControlPoints.MIDDLE_RIGHT:
        this.resizeService.cursorPosition = {x: ClickHelper.getXPosition(event), y: ToolConstants.NULL};
        if (this.altDown) {
          this.resizeService.resizeAxesFromCenter();
        } else {
          this.resizeService.resizeAxis();
        }
        break;
      case ControlPoints.BOTTOM_LEFT:
        this.resizeService.cursorPosition = {x: ClickHelper.getXPosition(event), y: ClickHelper.getYPosition(event)};
        if (this.altDown) {
          this.resizeService.resizeAxesFromCenter();
        } else if (this.shiftDown) {
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
        if (this.altDown) {
          this.resizeService.resizeAxesFromCenter();
        } else {
          this.resizeService.resizeAxis();
        }
        break;
      case ControlPoints.BOTTOM_RIGHT:
        this.resizeService.cursorPosition = {x: ClickHelper.getXPosition(event), y: ClickHelper.getYPosition(event)};
        if (this.altDown) {
          this.resizeService.resizeAxesFromCenter();
        } else if (this.shiftDown) {
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
        if (this.selectedControlPoint !== ControlPoints.NONE) {
          return;
        } else if (ClickHelper.cursorInsideObject({
          id: Id.RECTANGLE,
          x: this.selectorService.topCorner.x, y: this.selectorService.topCorner.y,
          height: this.selectorService.MinHeight, width: this.selectorService.MinWidth,
        },
          ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))) {
        this.dragOperation.x = this.selectorService.topCornerX;
        this.dragOperation.y = this.selectorService.topCornerY;
        this.shouldDrag = true;
      } else {
        this.isRightClick = false;
        this.isReverseSelection = false;
        this.resetComponent();
      }
      this.selectedControlPoint = ControlPoints.NONE;
    } else if (event.button === ClickTypes.RIGHT_CLICK) {
      this.isRightClick = true;
      if (!this.toolService.selectorBoxExists()) {
        this.isReverseSelection = false;
        this.resetComponent();
      } else {
        this.isReverseSelection = true;
      }
    }
    this.mouseDown = true;
  }

  protected handleMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      if (this.selectedControlPoint !== ControlPoints.NONE) {
        this.mouseMoved = true;
        this.handleControlPoint(event);
        return;
      }
      if (this.shouldDrag) {
        this.selectorService.dragObjects(ClickHelper.getXPosition(event), ClickHelper.getYPosition(event),
          this.windowWidth, this.windowHeight);
        this.traceBox();
        this.previewBox = { height: 0, width: 0, x: 0, y: 0 };
      } else {
        this.mouseMoved = true;
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
      }
    } else {
      this.mouseMoved = false;
    }
  }

  protected handleMouseUp(event: MouseEvent): void {
    // Single clicks
    if (this.mouseDown && !this.mouseMoved && !this.shouldDrag) {
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
        this.dragOperation.offsetX = this.selectorService.topCornerX - this.dragOperation.x;
        this.dragOperation.offsetY = this.selectorService.topCornerY - this.dragOperation.y;
        if (this.shouldDrag && (this.dragOperation.offsetX !== 0 || this.dragOperation.offsetY !== 0)) {
          this.selectorService.SelectedObjects.forEach((drawing) => {
            // indexes is defined in the constructor
            // tslint:disable-next-line: no-non-null-assertion
            this.dragOperation.indexes!.push(this.drawingStorage.drawings.indexOf(drawing));
          });
          this.saveService.saveDrawing({ ...this.dragOperation });
          this.dragOperation.indexes = [];
        }

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
