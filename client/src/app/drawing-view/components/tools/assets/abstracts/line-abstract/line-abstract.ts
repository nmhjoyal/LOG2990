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
    this.traceMode = ToolConstants.TRACE_MODE.CONTOUR;
    this.previewLine = {
      x1: 0,
      y1: 0,
     // x1: 0,
     // y2: 0,
     };
    this.lineStack = [];
    this.shape = {
      id: '',
      x1: 0,
      y1: 0,
      // x2: 0,
      // y2: 0,
      primaryColor: this.colorService.color[0], // take values of the colorService. Make sure they are updated dynamically...
      strokeOpacity: ToolConstants.DEFAULT_OPACITY, // load from color service
      strokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH, };
  }

  abstract ngOnInit(): void;

  abstract ngOnDestroy(): void;

  // Event handling methods

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    let lastSegment: IPreviewLine;
    lastSegment = {x1: event.offsetX, y1: event.offsetY };
    if (!this.started) {
      this.initialX = event.offsetX;
      this.initialY = event.offsetY;
      this.started = true;
    }/*
    lastSegment = {x1: this.lineStack[this.lineStack.length].x2, y1: this.lineStack[this.lineStack.length].y2,
                    x2: event.offsetX, y2: event.offsetY};*/
    this.mouseDown = true;
    this.addSegment(event.offsetX, event.offsetY);
  }

  @HostListener('mouseup') onMouseUp(): void {
   /* if (this.mouseDown && ((this.shape.x2 - this.shape.x1 > 0) || (this.shape.y2 - this.shape.y1 > 0 ))) {
      this.saveSegment();
    }*/
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    // this.onDoubleClick = true;
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
    this.previewLine.x1 = this.initialX;
    this.previewLine.y1 = this.initialY;
    this.calculateDimensions();

  }

  @HostListener('dblclick') onDoubleClick(event: MouseEvent): void {
    if (this.started) {
      this.addSegment(event.offsetX, event.offsetY);
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
/*
      case ToolConstants.TRACE_MODE.FILL:
        this.shape.primaryColor = this.colorService.color[0]; //
        this.traceMode = ToolConstants.TRACE_MODE.FILL;
        break;

      case ToolConstants.TRACE_MODE.CONTOUR_FILL:
        this.shape.primaryColor = this.colorService.color[0]; //
        this.traceMode = ToolConstants.TRACE_MODE.CONTOUR_FILL;
        break;
*/
      default:
        break;
    }
  }

  protected calculateDimensions(): void {
    this.shape.x1 = this.cursorX;
    this.shape.y1 = this.cursorY;
    // this.shape.x2 = this.initialX;
    // this.shape.y2 = this.initialY;
  }

  protected saveSegment(): void {
    for (const iterator of this.lineStack) {
      const currentDrawing: ILine = {
        id: this.shape.id,
        x1: iterator.x1,
        y1: iterator.y1,
      // x2: this.shape.x2,
      // y2: this.shape.y2,
        primaryColor: this.shape.primaryColor,
        strokeOpacity: this.shape.strokeOpacity,
        strokeWidth: this.shape.strokeWidth,
      };
      this.toolService.drawings.push(currentDrawing);
    }
    this.lineStack.length = 0;
  }
  protected addSegment(x: number, y: number): void {
    let lastSegment: IPreviewLine;
    lastSegment = {x1: x, y1: y };
    this.lineStack.push(lastSegment);
  }

}
