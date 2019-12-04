import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import RotateHelper from 'src/app/helpers/rotate-helper/rotate-helper';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { SelectorService } from 'src/app/services/selector-service/selector-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ClickTypes } from 'src/AppConstants/ClickTypes';
import { ShapeAbstract } from '../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../assets/attributes/attributes.service';
import { Id, ToolConstants } from '../assets/constants/tool-constants';

@Component({
  selector: 'app-tools-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent extends ShapeAbstract implements OnInit, OnDestroy {
  protected mouseMoved: boolean;
  protected isRightClick: boolean;
  protected isReverseSelection: boolean;
  protected shiftDown: boolean;
  protected angleIncrement: number;
  protected shouldDrag: boolean;
  protected isRotation: boolean;
  protected angleRotated: number;

  constructor(public toolService: ToolHandlerService, public drawingStorage: DrawingStorageService,
    saveRef: SaveService, attributesServiceRef: AttributesService, protected colourService: ColourService,
    protected selectorService: SelectorService) {
    super(saveRef, attributesServiceRef, colourService);
    this.shape.strokeWidth = 1;
    this.shape.primaryColour = 'black';
    this.shape.fillOpacity = 0;
    this.mouseMoved = false;
    this.shiftDown = false;
    this.angleIncrement = ToolConstants.ANGLE_INCREMENT_15;
    this.mouseDown = false;
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
    this.shouldDrag = false;
    this.handleMouseDown(event);
    super.onMouseDown(event);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    super.onMouseMove(event);
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

  // Rotation methods

  @HostListener('window:keyup.shift') onShiftUp(): void {
    this.shiftDown = false;
  }

  @HostListener('window:keydown.shift') onShiftDown(): void {
    this.shiftDown = true;
  }

  @HostListener('window:keydown.alt') onAltDown(): void {
    this.angleIncrement = this.angleIncrement === ToolConstants.ANGLE_INCREMENT_1 ?
      ToolConstants.ANGLE_INCREMENT_15 : ToolConstants.ANGLE_INCREMENT_1;
  }

  @HostListener('wheel', ['$event']) onWheel(event: WheelEvent): void {
    event.preventDefault();
    const rotateValue = event.deltaY > 0 ? this.angleIncrement : -this.angleIncrement;

    const x = this.selectorService.topCornerX + (this.selectorService.MinWidth / 2);
    const y = this.selectorService.topCornerY + (this.selectorService.MinHeight / 2);

    this.selectorService.selectedObjects.forEach((drawing) => {
            this.shiftDown ? RotateHelper.rotateOnItself(drawing, rotateValue) : RotateHelper.calculatePosition(drawing, rotateValue, x, y);

    });
    this.angleRotated += rotateValue;
    this.isRotation = this.angleRotated !== 0;
  }

  protected handleMouseDown(event: MouseEvent): void {
    if (event.button === ClickTypes.LEFT_CLICK) {
      if (this.selectorService.SelectedObjects.size > 0 &&
        ClickHelper.cursorInsideObject({
          id: Id.RECTANGLE,
          x: this.selectorService.topCornerX, y: this.selectorService.topCornerY,
          height: this.selectorService.MinHeight, width: this.selectorService.MinWidth,
        },
          ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))) {
        this.shouldDrag = true;
      } else {
        this.isRightClick = false;
        this.isReverseSelection = false;
        this.resetComponent();
      }
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
      if (this.shouldDrag) {
        this.selectorService.dragObjects(ClickHelper.getXPosition(event), ClickHelper.getYPosition(event),
          this.windowWidth, this.windowHeight);
        this.traceBox(this.selectorService.topCornerX, this.selectorService.topCornerY,
          this.selectorService.MinWidth, this.selectorService.MinHeight);
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
          this.traceBox(this.selectorService.topCornerX, this.selectorService.topCornerY,
            this.selectorService.MinWidth, this.selectorService.MinHeight);
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
    for (const drawing of this.drawingStorage.drawings) {
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
    for (const drawing of this.drawingStorage.drawings) {
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
