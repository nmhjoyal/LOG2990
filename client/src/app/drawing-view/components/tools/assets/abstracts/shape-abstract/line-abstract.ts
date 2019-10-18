import { HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ILine, IPreviewLine } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../attributes/attributes.service';

export abstract class LineAbstract implements OnInit, OnDestroy {
  protected initialX: number;
  protected initialY: number;
  protected cursorX: number;
  protected cursorY: number;
  protected mouseDown: boolean;
  protected shiftDown: boolean;
  protected previewLine: IPreviewLine;
  protected lineStack: IPreviewLine[];
  protected shape: ILine;
  protected traceMode: number;
  protected started: boolean;

  @Input() windowHeight: number;
  @Input() windowWidth: number;
  lastX: number;
  lastY: number;

  constructor(protected toolService: ToolHandlerService,
              protected attributesService: AttributesService,
              protected colorService: ColorService) {
    this.mouseDown = false;
    this.shiftDown = false;
    this.initialX = 0;
    this.initialY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.started = false;
    this.traceMode = ToolConstants.TRACE_MODE.CONTOUR_FILL;
    this.previewLine = {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
     };
    this.lineStack = [];
    this.shape = {
      id: '',
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      primaryColor: this.colorService.color[0], // take values of the colorService. Make sure they are updated dynamically...
      strokeOpacity: ToolConstants.DEFAULT_OPACITY, // load from color service
      strokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH, };
  }

  abstract ngOnInit(): void;

  abstract ngOnDestroy(): void;

  // Event handling methods

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    if (!this.started) {
      this.initialX = event.offsetX;
      this.initialY = event.offsetY;
      this.started = true;
    } else {
      let lastSegment: IPreviewLine = new IPreviewLine(event.offsetX, event.offsetY);
      this.lineStack.push(lastSegment);
    }
    this.mouseDown = true;
  }

  @HostListener('mouseup') onMouseUp(): void {
    if (this.mouseDown && ((this.shape.x2 - this.shape.x1 > 0) || (this.shape.y2 - this.shape.y1 > 0 ))) {
      this.saveSegment();
    }
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    if (this.mouseDown) {
      this.onMouseUp();
    }
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    this.cursorX = event.offsetX;
    this.cursorY = event.offsetY;
    this.calculateDimensions();
  }

  @HostListener('keyup.shift') onShiftUp(): void {
    this.shiftDown = false;
    this.calculateDimensions();
  }

  @HostListener('keydown.shift') onShiftDown(): void {
    this.shiftDown = true;
    this.lastX = this.initialX;
    this.lastY = this.initialY;
    this.calculateDimensions();

  }

  @HostListener('dblclick') onDoubleClick(): void {
    if (this.started) {
      this.addSegment();
      this.saveSegment();
    }
    this.started = false;
  }

  @HostListener('keydown.esc') onEscape(): void {
    this.lineStack.length = 0;
  }

  @HostListener('keydown.delete') onDelete(): void {
    this.lineStack.pop();
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
        this.shape.primaryColor = ToolConstants.NONE;
        this.traceMode = ToolConstants.TRACE_MODE.CONTOUR;
        break;

      case ToolConstants.TRACE_MODE.FILL:
        this.shape.primaryColor = this.colorService.color[0]; //
        this.traceMode = ToolConstants.TRACE_MODE.FILL;
        break;

      case ToolConstants.TRACE_MODE.CONTOUR_FILL:
        this.shape.primaryColor = this.colorService.color[0]; //
        this.traceMode = ToolConstants.TRACE_MODE.CONTOUR_FILL;
        break;

      default:
        break;
    }

  }
/*
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
*/
  protected saveSegment(): void {
    const currentDrawing: ILine = {
      id: '',
      x1: this.shape.x1,
      y1: this.shape.y1,
      x2: this.shape.x2,
      y2: this.shape.y2,
      primaryColor: this.shape.primaryColor,
      strokeOpacity: this.shape.strokeOpacity,
      strokeWidth: this.shape.strokeWidth,
    };
    this.toolService.drawings.push(currentDrawing);
  }
  protected calculateDimensions(): void {
    // tslint:disable-next-line:no-magic-numbers
    // const shapeOffset = this.shape.strokeWidth / 2;

    this.previewLine.x1 = this.cursorX;
    this.previewLine.y1 = this.cursorY;
    this.previewLine.x2 = this.initialX;
    this.previewLine.y2 = this.initialY;
    /*this.shape.x =  this.previewBox.x + shapeOffset;
    this.shape.y =  this.previewBox.y + shapeOffset;
    this.shape.width = this.previewBox.width > this.shape.strokeWidth ? this.previewBox.width - this.shape.strokeWidth : 0;
    this.shape.height = this.previewBox.height > this.shape.strokeWidth ? this.previewBox.height - this.shape.strokeWidth : 0;*/
  }

  protected addSegment(): void {
    if (this.shiftDown){}
    this.lineStack.forEach((element) => {
      this.shape.x1 += element.x1;
    });
    this.lineStack.length = 0;
  }

}
