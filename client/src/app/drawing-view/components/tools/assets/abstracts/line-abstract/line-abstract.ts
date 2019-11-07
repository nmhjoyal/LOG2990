import { HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ILine } from 'src/app/drawing-view/components/tools/assets/interfaces/drawing-tool-interface';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
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
  protected previewPoints: string[];
  protected started: boolean;
  protected finalPoints: string;
  protected traceMode: number;
  protected junctionMode: number;

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
    this.traceMode = ToolConstants.TRACE_MODE.STRAIGHT;
    this.junctionMode = ToolConstants.POINT_MODE.ROUNDED;
    this.stroke  = {
      id: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      points: '',
      color: this.colorService.color[0],
      strokeOpacity: ToolConstants.DEFAULT_OPACITY,
      strokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      fill: ToolConstants.NONE,
      pointWidth: ToolConstants.DEFAULT_POINT_WIDTH,
      strokeLinecap: ToolConstants.ROUND,
      strokeLinejoin: ToolConstants.ROUND,
      strokeDashArray: ToolConstants.STRAIGHT,
    };
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
        this.cursorX = ClickHelper.getXPosition(event);
        this.cursorY = ClickHelper.getYPosition(event);
      }
      this.stroke.points = this.previewPoints + ' ' + this.cursorX + ',' + this.cursorY;
    }
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    if (!this.started) {
      this.initialX = ClickHelper.getXPosition(event);
      this.initialY = ClickHelper.getYPosition(event);
      this.started = true;
      this.stroke.points = ' ' + ClickHelper.getXPosition(event) + ',' + ClickHelper.getYPosition(event);
      this.previewPoints.push(' ' + ClickHelper.getXPosition(event) + ',' + ClickHelper.getYPosition(event));
    } else {
      this.addSegment();
    }
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
      this.getPositionAndDimensions();
      this.saveSegment();
    }
    this.stroke.points = '';
    this.previewPoints.length = 0;
    this.started = false;
  }

  @HostListener('keydown.esc') onEscape(): void {
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
      x: this.stroke.x,
      y: this.stroke.y,
      width: this.stroke.width,
      height: this.stroke.height,
      points: this.stroke.points,
      color: this.stroke.color,
      strokeOpacity: this.stroke.strokeOpacity,
      strokeWidth: this.stroke.strokeWidth,
      fill: this.stroke.fill,
      pointWidth: this.stroke.pointWidth,
      strokeLinecap: this.stroke.strokeLinecap,
      strokeLinejoin: this.stroke.strokeLinejoin,
      strokeDashArray: this.stroke.strokeDashArray,
    };
    this.toolService.saveDrawing(currentDrawing);
  }

  protected addSegment(): void {
    if (this.shiftDown) {
      this.previewPoints.push(' ' + this.initialX + ',' + this.initialY);
    } else {
      this.previewPoints.push(' ' + this.cursorX + ',' + this.cursorY);
    }
  }

  protected setJunctionMode(junctionMode: number): void {
    switch (junctionMode) {
      case ToolConstants.POINT_MODE.ANGLED:
        this.stroke.strokeLinecap = ToolConstants.BUTT;
        this.junctionMode = junctionMode;
        break;

      case ToolConstants.POINT_MODE.ROUNDED:
        this.stroke.strokeLinecap = ToolConstants.ROUND;
        this.junctionMode = junctionMode;
        break;

      case ToolConstants.POINT_MODE.DOTTED:
        this.stroke.strokeLinecap = ToolConstants.SQUARE;
        this.junctionMode = junctionMode;
        break;

      default:
        break;
    }
  }

  protected setTraceMode(traceMode: number): void {
    switch (traceMode) {
      case ToolConstants.TRACE_MODE.STRAIGHT:
        this.stroke.strokeDashArray = ToolConstants.STRAIGHT;
        this.traceMode = traceMode;
        break;

      case ToolConstants.TRACE_MODE.DOTTED_LINE:
        this.stroke.strokeDashArray = ToolConstants.DOTTED_LINE;
        this.traceMode = traceMode;
        break;

      case ToolConstants.TRACE_MODE.DOTTED_POINT:
        this.stroke.strokeDashArray = ToolConstants.DOTTED_POINT;
        this.traceMode = traceMode;
        break;

      default:
        break;
      }
  }

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

  protected getPositionAndDimensions(): void {
    if (this.stroke.points !== undefined) {
      const pointsList = this.stroke.points.split(' ');
      this.stroke.x = this.windowWidth;
      this.stroke.y = this.windowHeight;
      this.stroke.width = 0;
      this.stroke.height = 0;
      for (const point of pointsList) {
        const coordinates = point.split(',');
        if (coordinates.length > 1) {
          this.stroke.x = Number(coordinates[0].trim()) < this.stroke.x ? Number(coordinates[0].trim()) : this.stroke.x;
          this.stroke.width = Number(coordinates[0].trim()) > this.stroke.width ? Number(coordinates[0].trim()) : this.stroke.width;
          this.stroke.y = Number(coordinates[1].trim()) < this.stroke.y ? Number(coordinates[1].trim()) : this.stroke.y;
          this.stroke.height = Number(coordinates[1].trim()) > this.stroke.height ? Number(coordinates[1].trim()) : this.stroke.height;
        }
      }
      this.stroke.width = this.stroke.width - this.stroke.x;
      this.stroke.height = this.stroke.height - this.stroke.y;
    }
  }
}
