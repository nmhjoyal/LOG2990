import { HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { IPreviewBox, IShape } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../attributes/attributes.service';

export abstract class ShapeAbstract implements OnInit, OnDestroy {
  protected initialX: number;
  protected initialY: number;
  protected cursorX: number;
  protected cursorY: number;
  protected mouseDown: boolean;
  protected shiftDown: boolean;
  protected previewBox: IPreviewBox;
  protected shape: IShape;
  protected traceMode: number;

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  constructor(protected toolService: ToolHandlerService, protected attributesService: AttributesService) {
    this.mouseDown = false;
    this.shiftDown = false;
    this.initialX = 0;
    this.initialY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.traceMode = ToolConstants.TRACE_MODE.CONTOUR_FILL;
    this.previewBox = {
      x: 0,
      y: 0,
      width: 0,
      height: 0, };
    this.shape = {
      id: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      primaryColor: 'green', // take values of the colorService. Make sure they are updated dynamically...
      secondaryColor: 'blue',
      strokeOpacity: ToolConstants.DEFAULT_OPACITY, // load from color service
      strokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      fillOpacity: ToolConstants.DEFAULT_OPACITY, /* load from color service */ };
  }

  abstract ngOnInit(): void;

  abstract ngOnDestroy(): void;

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
      case ToolConstants.TRACE_MODE.CONTOUR:
        this.shape.secondaryColor = 'blue'; // load from color service
        this.shape.primaryColor = ToolConstants.NONE;
        this.traceMode = ToolConstants.TRACE_MODE.CONTOUR;
        break;

      case ToolConstants.TRACE_MODE.FILL:
        // this.shape.secondaryColor = ToolConstants.NONE; IF the contour should affect width when it is not set
        this.shape.primaryColor = 'green'; // load from color service
        this.shape.secondaryColor = this.shape.primaryColor; // If contour should not be discernable when not set.
        this.traceMode = ToolConstants.TRACE_MODE.FILL;
        break;

      case ToolConstants.TRACE_MODE.CONTOUR_FILL:
        this.shape.secondaryColor = 'blue'; // load from color service
        this.shape.primaryColor = 'green'; // load from color service
        this.traceMode = ToolConstants.TRACE_MODE.CONTOUR_FILL;
        break;

      default:
        break;
    }

  }

  protected calculateDimensions(): void {
    // tslint:disable-next-line:no-magic-numbers
    const shapeOffset = this.shape.strokeWidth / 2;

    this.previewBox.x = this.cursorX < this.initialX ? this.cursorX : this.initialX;
    this.previewBox.y = this.cursorY < this.initialY ? this.cursorY : this.initialY;
    this.previewBox.width = Math.abs(this.cursorX - this.initialX);
    this.previewBox.height = Math.abs(this.cursorY - this.initialY);
    this.shape.x =  this.previewBox.x + shapeOffset;
    this.shape.y =  this.previewBox.y + shapeOffset;
    this.shape.width = this.previewBox.width > this.shape.strokeWidth ? this.previewBox.width - this.shape.strokeWidth : 0;
    this.shape.height = this.previewBox.height > this.shape.strokeWidth ? this.previewBox.height - this.shape.strokeWidth : 0;
  }

  protected saveShape(): void {
    const currentDrawing: IShape = {
      id: this.shape.id,
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
