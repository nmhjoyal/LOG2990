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
  protected pointMode: number;
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
    this.pointMode = ToolConstants.POINT_MODE.ANGLED;
    this.previewLine = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      stroke: 'black',
     };
    this.lineStack = [];
    this.shape = {
      id: 'line',
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      stroke: this.colorService.color[0], // take values of the colorService. Make sure they are updated dynamically...
      strokeOpacity: ToolConstants.DEFAULT_OPACITY, // load from color service
      strokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      pointWidth: ToolConstants.DEFAULT_POINT_WIDTH, };
  }

  abstract ngOnInit(): void;

  abstract ngOnDestroy(): void;

  // Event handling methods

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    if (!this.started) {
      this.initialX = event.offsetX;
      this.initialY = event.offsetY;
      this.started = true;
      let firstSegment: IPreviewLine;
      firstSegment = {x1: this.initialX, y1: this.initialY,
                  x2: this.initialX, y2: this.initialY, stroke: this.colorService.color[0] };
      this.lineStack.push(firstSegment);
    } else {
    this.addSegment(event.offsetX, event.offsetY);
    }
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

  protected decreasePointWidth(): void {
    if (this.shape.strokeWidth !== 0) {
      this.shape.pointWidth--;
    }
  }

  protected increasePointWidth(): void {
    this.shape.pointWidth++;
  }

  protected setTraceMode(mode: number): void {
    switch (mode) {
      case ToolConstants.POINT_MODE.ANGLED:
        this.pointMode = ToolConstants.TRACE_MODE.CONTOUR;
        break;

      case ToolConstants.POINT_MODE.ROUNDED:
        this.pointMode = ToolConstants.TRACE_MODE.FILL;
        break;

      case ToolConstants.POINT_MODE.DOTTED:
        this.pointMode = ToolConstants.TRACE_MODE.CONTOUR_FILL;
        break;

      default:
        break;
    }
  }

  protected calculateDimensions(): void {
    this.previewLine.x1 = this.lineStack[this.lineStack.length].x2;
    this.previewLine.y1 = this.lineStack[this.lineStack.length].y2;
    this.previewLine.x2 = this.cursorX;
    this.previewLine.y2 = this.cursorY;
    this.previewLine.stroke = 'black';
    if (this.shiftDown) {
      this.previewLine.x2 = this.initialX;
      this.previewLine.y2 = this.initialY;
    }
    this.shape.x1 = this.previewLine.x1;
    this.shape.y1 = this.previewLine.y1;
    this.shape.x2 = this.previewLine.x2;
    this.shape.y2 = this.previewLine.y2;
  }

  protected saveSegment(): void {
    for (const iterator of this.lineStack) {
      const currentDrawing: ILine = {
        id: this.shape.id,
        x1: iterator.x1,
        y1: iterator.y1,
        x2: iterator.x2,
        y2: iterator.y2,
        stroke: this.shape.stroke,
        strokeOpacity: this.shape.strokeOpacity,
        strokeWidth: this.shape.strokeWidth,
        pointWidth: this.shape.pointWidth,
      };
      this.toolService.drawings.push(currentDrawing);
    }
    this.lineStack.length = 0;
  }
  protected addSegment(eventx: number, eventy: number): void {
    let lastSegment: IPreviewLine;
    lastSegment = {x1: this.lineStack[this.lineStack.length].x2, y1: this.lineStack[this.lineStack.length].y2,
                  x2: eventx, y2: eventy, stroke: this.colorService.color[0] };
    this.lineStack.push(lastSegment);
  }

}
