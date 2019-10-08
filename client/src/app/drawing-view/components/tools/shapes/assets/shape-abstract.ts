import { HostListener, Input, OnInit } from '@angular/core';
import { IPreviewBox, IShape } from 'src/app/drawing-view/components/tools/shapes/assets/interfaces/shape-interface';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';

const DEFAULT_OPACITY = 1;
const DEFAULT_STROKE_WIDTH = 2;
const CONTOUR_MODE = 1;
const FILL_MODE = 2;
const CONTOUR_FILL_MODE = 3;

export abstract class ShapeAbstract implements OnInit {
  protected initialX: number;
  protected initialY: number;
  protected cursorX: number;
  protected cursorY: number;
  protected mouseDown: boolean;
  protected shiftDown: boolean;
  protected previewBox: IPreviewBox;
  protected shape: IShape;

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  constructor(protected toolService: ToolHandlerService) {
    this.mouseDown = false;
    this.shiftDown = false;
    this.initialX = 0;
    this.initialY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.previewBox = {
      x: 0,
      y: 0,
      width: 0,
      height: 0, };
    this.shape = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      primaryColor: 'green', // take values of the colorService.
      secondaryColor: 'blue',
      strokeOpacity: DEFAULT_OPACITY,
      strokeWidth: DEFAULT_STROKE_WIDTH,
      fillOpacity: DEFAULT_OPACITY,
    };
  }

  ngOnInit(): void {
    // empty body
  }

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
    this.previewBox.height = 0;
    this.previewBox.width = 0;
    this.previewBox.x = 0;
    this.previewBox.y = 0;
    this.initialY = 0;
    this.initialX = 0;
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
    this.shape.strokeWidth++;
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

    this.previewBox.x = this.cursorX < this.initialX ? this.cursorX : this.initialX;
    this.previewBox.y = this.cursorY < this.initialY ? this.cursorY : this.initialY;
    this.previewBox.width = Math.abs(this.cursorX - this.initialX);
    this.previewBox.height = Math.abs(this.cursorY - this.initialY);
    this.shape.x =  this.previewBox.x + shapeOffset;
    this.shape.y =  this.previewBox.y + shapeOffset;
    this.shape.width = this.previewBox.width - this.shape.strokeWidth;
    this.shape.height = this.previewBox.height - this.shape.strokeWidth;
  }

  protected saveShape(): void {
    const currentDrawing: IShape = {
      x: this.shape.x,
      y: this.shape.y,
      width: this.shape.width,
      height: this.shape.height,
      primaryColor: this.shape.primaryColor,
      secondaryColor: this.shape.secondaryColor,
      strokeOpacity: this.shape.strokeOpacity,
      strokeWidth: this.shape.strokeWidth,
      fillOpacity: this.shape.fillOpacity,
    };
    this.toolService.drawings.push(currentDrawing);
  }

}
