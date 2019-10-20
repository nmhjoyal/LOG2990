import { HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ILine } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../attributes/attributes.service';
import { ToolAbstract } from '../tool-abstract/tool-abstract';

export abstract class LineAbstract extends ToolAbstract implements OnInit, OnDestroy {
  protected initialX: number;
  protected initialY: number;
  protected cursorX: number;
  protected cursorY: number;
  protected mouseDown: boolean;
  protected shiftDown: boolean;
  protected stroke: ILine;
  protected pointMode: number;
  protected previewPoints: string[];
  protected started: boolean;
  protected finalPoints: string;

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  constructor(protected toolService: ToolHandlerService,
              protected attributesService: AttributesService,
              protected colorService: ColorService) {
    super();
    this.mouseDown = false;
    this.shiftDown = false;
    this.initialX = 0;
    this.initialY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.started = false;
    this.previewPoints = [];
    this.pointMode = ToolConstants.POINT_MODE.ANGLED;
    this.stroke  = {
      id: '',
      points: '',
      color: this.colorService.color[0],
      strokeOpacity: ToolConstants.DEFAULT_OPACITY, // load from color service
      strokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      fill: ToolConstants.NONE,
      pointWidth: ToolConstants.DEFAULT_POINT_WIDTH,
      strokeLinecap: ToolConstants.ROUND,
      strokeLinejoin: ToolConstants.ROUND,
      strokeDashArray: ToolConstants.DOTTED_LINE,
    };
    /*
    this.shape = {
      id: '',
      points: '',
      color: this.colorService.color[0], // take values of the colorService. Make sure they are updated dynamically...
      strokeOpacity: ToolConstants.DEFAULT_OPACITY, // load from color service
      strokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      fill: ToolConstants.NONE,
      pointWidth: ToolConstants.DEFAULT_POINT_WIDTH,
      strokeLinecap: ToolConstants.ROUND,
      strokeLinejoin: ToolConstants.ROUND, };
      */
  }

  abstract ngOnInit(): void;
  abstract ngOnDestroy(): void;
  abstract saveAttribute(): void;

  // Event handling methods
  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if (this.started) {
      if (this.shiftDown) {
        this.cursorX = this.initialX;
        this.cursorY = this.initialY;
      } else {
        this.cursorX = event.offsetX;
        this.cursorY = event.offsetY;
      }
      this.stroke.points = this.previewPoints + ' ' + this.cursorX + ',' + this.cursorY;
    }
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    if (!this.started) {
      this.initialX = event.offsetX;
      this.initialY = event.offsetY;
      this.started = true;
      this.stroke.points = event.offsetX + ',' + event.offsetY;
      // this.shape.points = event.offsetX + ',' + event.offsetY;
      this.previewPoints.push(event.offsetX + ',' + event.offsetY);
    } else {
      // this.shape.points += ' ' + event.offsetX + ',' + event.offsetY;
      this.addSegment();
    }
  }

  @HostListener('mouseup') onMouseUp(): void {
    this.mouseDown = false;
  }

  @HostListener('keyup.shift') onShiftUp(): void {
    this.shiftDown = false;
  }

  @HostListener('keydown.shift') onShiftDown(): void {
    this.shiftDown = true;
  }

  @HostListener('dblclick') onDoubleClick(): void {
    if (this.started) {
      this.addSegment();
      // this.shape.points += ' ' + this.cursorX + ',' + this.cursorY;
      this.saveSegment();
    }
    // this.shape.points = '';
    this.stroke.points = '';
    this.previewPoints.length = 0;
    this.started = false;
  }

  @HostListener('keydown.esc') onEscape(): void {
    // this.shape.points = '';
    this.stroke.points = '';
    this.previewPoints.length = 0;
    this.started = false;
  }

  @HostListener('keydown.backspace') onDelete(): void {
    this.previewPoints.pop();
  }

  // Functions
  protected decreaseStrokeWidth(): void {
    if (this.stroke.strokeWidth !== 0) {
      this.stroke.strokeWidth--;
    }
  }

  protected saveSegment(): void {
    this.previewPoints.forEach((element) => {
      this.finalPoints += ' ' + element;
    });
    const currentDrawing: ILine = {
      id: this.stroke.id,
      points: this.stroke.points,
      // points: this.shape.points,
      color: this.stroke.color,
      strokeOpacity: this.stroke.strokeOpacity,
      strokeWidth: this.stroke.strokeWidth,
      fill: this.stroke.fill,
      pointWidth: this.stroke.pointWidth,
      strokeLinecap: this.stroke.strokeLinecap,
      strokeLinejoin: this.stroke.strokeLinejoin,
      strokeDashArray: this.stroke.strokeDashArray,
    };
    this.toolService.drawings.push(currentDrawing);
  }

  protected addSegment(): void {
    if (this.shiftDown) {
    this.previewPoints.push(this.initialX + ',' + this.initialY);
    } else {
      this.previewPoints.push(this.cursorX + ',' + this.cursorY);
    }
  }

  protected setJunctionMode(pointMode: number): void {
    switch (pointMode) {
      case ToolConstants.POINT_MODE.ANGLED:
        this.stroke.strokeLinecap = ToolConstants.BUTT;
        break;

      case ToolConstants.POINT_MODE.ROUNDED:
        this.stroke.strokeLinecap = ToolConstants.ROUND;
        break;

      case ToolConstants.POINT_MODE.DOTTED:
        this.stroke.strokeLinecap = ToolConstants.SQUARE;
        break;

      default:
        break;
    }
  }

  protected setTraceMode(lineMode: number): void {
    switch (lineMode) {
      case ToolConstants.TRACE_MODE.STRAIGHT:
        this.stroke.strokeDashArray = '0';
        break;

      case ToolConstants.TRACE_MODE.DOTTED_LINE:
        this.stroke.strokeDashArray = '4';
        break;

      case ToolConstants.TRACE_MODE.DOTTED_POINT:
        this.stroke.strokeDashArray = '4 1';
        break;

      default:
        break;
      }
  }
  /*
  protected setMode(pointMode: number): void {
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
  }*/

  protected increaseStrokeWidth(): void {
    this.stroke.strokeWidth++;
  }

  protected decreasePointWidth(): void {
    if (this.stroke.strokeWidth !== 0) {
      this.stroke.pointWidth--;
    }
  }

  protected increasePointWidth(): void {
    this.stroke.pointWidth++;
  }
}
