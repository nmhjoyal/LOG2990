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
      strokeLinecap: ToolConstants.BUTT,
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
      strokeLinecap: ToolConstants.BUTT,
      strokeLinejoin: ToolConstants.ROUND, };
  }

  abstract ngOnInit(): void;
  abstract ngOnDestroy(): void;
  abstract saveAttribute(): void;

  // Event handling methods
  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if (this.shiftDown) {
      this.cursorX = this.initialX;
      this.cursorY = this.initialY;
    } else {
    this.cursorX = event.offsetX;
    this.cursorY = event.offsetY;
    }
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    if (!this.started) {
      this.initialX = event.offsetX;
      this.initialY = event.offsetY;
      this.started = true;
      this.previewPoints.push(this.cursorX + ',' + this.cursorY);
      this.shape.points = this.cursorX + ',' + this.cursorY;
    } else {
      this.shape.points += ' ' + this.cursorX + ',' + this.cursorY;
    }
    this.nextLine.points = this.shape.points + ' ' + this.cursorX + ',' + this.cursorY;
    this.addSegment(event.offsetX, event.offsetY);

  }

  @HostListener('mouseup') onMouseUp(): void {
    this.mouseDown = false;
   /* if (this.mouseDown && ((this.shape.x2 - this.shape.x1 > 0) || (this.shape.y2 - this.shape.y1 > 0 ))) {
      this.saveSegment();
    }*/
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    // this.onDoubleClick = true;
  }

  @HostListener('keyup.shift') onShiftUp(): void {
    this.shiftDown = false;
    // this.calculateDimensions();
  }

  @HostListener('keydown.shift') onShiftDown(): void {
    this.shiftDown = true;
    // this.calculateDimensions();
  }

  @HostListener('dblclick') onDoubleClick(): void {
    if (this.started) {
      this.shape.points += ' ' + this.cursorX + ',' + this.cursorY;
      this.addSegment(this.cursorX, this.cursorY);
      this.saveSegment();
    }
    this.started = false;
    this.shape.points = '';
  }

  @HostListener('keydown.esc') onEscape(): void {
    this.shape.points = '';
  }

  @HostListener('keydown.delete') onDelete(): void {
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
      // points: this.finalPoints,
      points: this.shape.points,
      color: this.shape.color,
      strokeOpacity: this.shape.strokeOpacity,
      strokeWidth: this.shape.strokeWidth,
      fill: this.shape.fill,
      pointWidth: this.shape.pointWidth,
      strokeLinecap: this.shape.strokeLinecap,
      strokeLinejoin: this.shape.strokeLinejoin,
    };
    this.toolService.drawings.push(currentDrawing);
  }

  protected addSegment(coordX: number, coordY: number): void {
    if (this.shiftDown) {
    this.previewPoints.push(this.initialX + ',' + this.initialY);
    } else {
      this.previewPoints.push(coordX + ',' + coordY);
    }
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
