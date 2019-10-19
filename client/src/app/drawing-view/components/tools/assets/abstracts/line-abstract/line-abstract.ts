import { HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Coordinate, ILine, IPreviewLine } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
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
 //  protected lineStack: IPreviewLine[];
  protected shape: ILine;
  protected pointMode: number;
  protected started: boolean;
  protected point: Coordinate;

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
      points: [],
      stroke: 'black',
     };
    // this.lineStack = [];
    this.shape = {
      id: 'line',
      points: [],
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
    }
    this.addSegment();
    /*
      let newPoint: Coordinate;
      newPoint = {x: event.offsetX, y: event.offsetY};
      this.previewLine.points.push(newPoint); /*
      let firstSegment: IPreviewLine;
      firstSegment = {x1: this.initialX, y1: this.initialY,
                  x2: this.initialX, y2: this.initialY, stroke: this.colorService.color[0] };
      this.lineStack.push(firstSegment);
    } else {
    this.addSegment(event.offsetX, event.offsetY);
    }*/
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

  @HostListener('dblclick') onDoubleClick(): void {
    if (this.started) {
      this.addSegment();
      this.saveSegment();
    }
    this.started = false;
  }

  @HostListener('keydown.esc') onEscape(): void {
    this.shape.points.length = 0;
  }

  @HostListener('keydown.delete') onDelete(): void {
    this.shape.points.pop();
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

  protected setTraceMode(pointMode: number): void {
    switch (pointMode) {
      case ToolConstants.POINT_MODE.ANGLED:
        this.pointMode = ToolConstants.POINT_MODE.ANGLED;
        break;

      case ToolConstants.POINT_MODE.ROUNDED:
        this.pointMode = ToolConstants.POINT_MODE.ROUNDED;
        break;

      case ToolConstants.POINT_MODE.DOTTED:
        this.pointMode = ToolConstants.POINT_MODE.DOTTED;
        break;

      default:
        break;
    }
  }

  protected calculateDimensions(): void {
    this.previewLine.stroke = 'black';
    if (this.shiftDown) {
      this.point.x = this.initialX;
      this.point.y = this.initialY;
    } else {
      this.point.x = this.cursorX;
      this.point.y = this.cursorY;
    }
    this.previewLine.points.push(this.point);
    this.shape.points = this.previewLine.points;
  }

  protected saveSegment(): void {
      const currentDrawing: ILine = {
        id: this.shape.id,
        points: this.shape.points,
        stroke: this.shape.stroke,
        strokeOpacity: this.shape.strokeOpacity,
        strokeWidth: this.shape.strokeWidth,
        pointWidth: this.shape.pointWidth,
      };
      this.toolService.drawings.push(currentDrawing);
    this.previewLine.points.length = 0;
  }
  protected addSegment(): void {
    if (this.shiftDown) {
      this.point.x = this.initialX;
      this.point.y = this.initialY;
    } else {
      this.point.x = this.cursorX;
      this.point.y = this.cursorY;
    }
    this.previewLine.points.push(this.point);
  }

}
