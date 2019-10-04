import { HostListener, Input, OnInit } from '@angular/core';
import { IShape } from 'src/app/drawing-view/components/tools/shapes/interfaces/shape-interface'
import { ToolHandlerService } from 'src/app/services/tool-handler.service';

const DEFAULT_OPACITY = 1;
const DEFAULT_STROKE_WIDTH = 2;
const CONTOUR_MODE = 1;
const FILL_MODE = 2;
const CONTOUR_FILL_MODE = 3;

export abstract class ShapeAbstract implements OnInit {
  protected initialX = 0;
  protected initialY = 0;
  protected cursorX: number;
  protected cursorY: number;
  protected previewWidth: number;
  protected previewHeight: number;

  protected shape: IShape;
  
  protected mouseDown = false;
  protected shiftDown = false;

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  constructor(protected toolService: ToolHandlerService) {
    this.shape.strokeOpacity = DEFAULT_OPACITY;
    this.shape.fillOpacity = DEFAULT_OPACITY;
    this.shape.strokeWidth = DEFAULT_STROKE_WIDTH;
  }

  ngOnInit(): void {
    // empty body
  }

  // Abstract methods

  protected abstract saveShape(): void;

  // Event handling methods

  @HostListener('mousedown', ['$event']) onMouseDown(event: any): void {
    this.initialX = event.offsetX;
    this.initialY = event.offsetY;
    this.mouseDown = true;
  }

  @HostListener('mouseup') onMouseUp(): void {

    if (this.mouseDown && (this.shape.height > 0 && this.shape.width > 0)) {
      this.saveShape();
    }

    this.mouseDown = false;
    this.shape.height = 0;
    this.shape.width = 0;
    this.previewHeight = 0;
    this.previewWidth = 0;
    this.initialX = 0;
    this.initialY = 0;
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    if (this.mouseDown) {
      this.onMouseUp();
    }
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: any): void {
    this.cursorX = event.offsetX;
    this.cursorY = event.offsetY;

    if (this.mouseDown) {
      this.previewWidth = this.cursorX - this.initialX;
      this.previewHeight = this.cursorY - this.initialY;
      this.calculateDimensions();
    }
  }

  @HostListener('keyup.shift') onShiftUp(): void {
    this.shiftDown = false;
    if (this.mouseDown) {
      this.calculateDimensions();
    }
  }

  @HostListener('keydown.shift') onShiftDown(): void {
    this.shiftDown = true;
    if (this.mouseDown) {
      this.calculateDimensions();
    }
  }

  // Functions

  protected decreaseStrokeWidth(): void {
    if (this.shape.strokeWidth !== 0) {
      this.shape.strokeWidth--;
    }
  }

  protected increaseStrokeWidth(): void {
    this.strokeWidth++;
  }

  protected setTraceMode(mode: number): void {
    switch (mode) {
      case CONTOUR_MODE:
        this.shape.strokeOpacity = 1; // load from color service
        this.shape.fillOpacity = 0;
        break;

      case FILL_MODE:
        this.shape.strokeOpacity = 0;
        this.shape.fillOpacity = 1; // load from color service
        break;

      case CONTOUR_FILL_MODE:
          this.shape.strokeOpacity = 1; // load from color service
          this.shape.fillOpacity = 1; // load from color service
          break;

      default:
        break;
    }

  }

  protected calculateDimensions(): void {
    const shapeOffset = this.shape.strokeWidth / 2;

    this.shape.x = this.initialX + shapeOffset;
    this.shape.y = this.initialY + shapeOffset;
    this.shape.width =  this.cursorX - this.shape.x - shapeOffset;
    this.shape.height = this.cursorY - this.shape.y - shapeOffset;
  }


}
