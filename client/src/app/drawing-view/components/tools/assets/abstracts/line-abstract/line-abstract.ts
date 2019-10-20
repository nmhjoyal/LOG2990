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
  protected shape: ILine;
  protected nextLine: ILine;
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
    this.nextLine  = {
      id: '',
      points: '',
      color: 'black',
      strokeOpacity: ToolConstants.DEFAULT_OPACITY, // load from color service
      strokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      fill: ToolConstants.NONE,
      pointWidth: ToolConstants.DEFAULT_POINT_WIDTH,
      strokeLinecap: ToolConstants.ROUND,
      strokeLinejoin: ToolConstants.ROUND,
    };
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
      this.nextLine.points = this.previewPoints + ' ' + this.cursorX + ',' + this.cursorY;
    }
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    if (!this.started) {
      this.initialX = event.offsetX;
      this.initialY = event.offsetY;
      this.started = true;
      this.nextLine.points = event.offsetX + ',' + event.offsetY;
      this.shape.points = event.offsetX + ',' + event.offsetY;
      this.previewPoints.push(event.offsetX + ',' + event.offsetY);
    } else {
      this.shape.points += ' ' + event.offsetX + ',' + event.offsetY;
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
      this.shape.points += ' ' + this.cursorX + ',' + this.cursorY;
      this.saveSegment();
    }
    // this.shape.points = '';
    this.nextLine.points = '';
    this.previewPoints.length = 0;
    this.started = false;
  }

  @HostListener('keydown.esc') onEscape(): void {
    // this.shape.points = '';
    this.nextLine.points = '';
    this.previewPoints.length = 0;
    this.started = false;
  }

  @HostListener('keydown.backspace') onDelete(): void {
    this.previewPoints.pop();
  }

  // Functions
  protected decreaseStrokeWidth(): void {
    if (this.shape.strokeWidth !== 0) {
      this.shape.strokeWidth--;
    }
  }

  protected saveSegment(): void {
    this.previewPoints.forEach((element) => {
      this.finalPoints += ' ' + element;
    });
    const currentDrawing: ILine = {
      id: this.shape.id,
      points: this.finalPoints,
      // points: this.shape.points,
      color: this.shape.color,
      strokeOpacity: this.shape.strokeOpacity,
      strokeWidth: this.shape.strokeWidth,
      fill: this.shape.fill,
      pointWidth: this.shape.pointWidth,
      strokeLinecap: this.shape.strokeLinecap,
      strokeLinejoin: this.shape.strokeLinejoin,
    };
    this.toolService.drawings.push(this.nextLine);
  }

  protected addSegment(): void {
    if (this.shiftDown) {
    this.previewPoints.push(this.initialX + ',' + this.initialY);
    } else {
      this.previewPoints.push(this.cursorX + ',' + this.cursorY);
    }
  }

  protected setTraceMode(pointMode: number): void {
    switch (pointMode) {
      case ToolConstants.POINT_MODE.ANGLED:
        this.shape.strokeLinecap = ToolConstants.BUTT;
        break;

      case ToolConstants.POINT_MODE.ROUNDED:
        this.shape.strokeLinecap = ToolConstants.ROUND;
        break;

      case ToolConstants.POINT_MODE.DOTTED:
        this.shape.strokeLinecap = ToolConstants.SQUARE;
        break;

      default:
        break;
    }
  }
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
}
