import { HostListener, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';

const STROKE_LINECAP_MODE = 'round';
const FILL_MODE = 'none';
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_FILTER = 'none';

export abstract class DrawingToolsAbstract implements OnInit {
  _points: string;
  private _mouseDown = false;
  private _strokeWidth: number = DEFAULT_STROKE_WIDTH;
  private _color = 'black';
  private _filter: string = DEFAULT_FILTER;
  private _x: number;
  private _y: number;

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  protected drawingToolService: LocalStorageService;

  constructor(serviceInstance: LocalStorageService) {
    this.drawingToolService = serviceInstance;
   }

  ngOnInit() {
  }

  // Abstract methods

  protected abstract saveShape(): void;

  // Event handling methods

  @HostListener('mousedown', ['$event']) onMouseDown(event: any) {
    this._mouseDown = true;
    this._points = event.offsetX + ',' + event.offsetY;
    this._x = event.offsetX;
    this._y = event.offsetY;
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: any) {
    if (this._mouseDown) {
      this._points += (' ' + event.offsetX + ',' + event.offsetY);
    }
    this.saveShape();
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: any) {

    if (this._x == event.offsetX && this._y == event.offsetY) {
      this._points += (' ' + (event.offsetX + 0.1) + ',' + (event.offsetY + 0.1));
    }
    this._mouseDown = false;

    this._points = '';
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: any) {
    if (this._mouseDown) {
      this.onMouseUp(event);
    }
  }

  // Functions

  increaseStrokeWidth() {
    this._strokeWidth++;
  }

  decreaseStrokeWidth() {
    if (this._strokeWidth > 1) {
      this._strokeWidth--;
    }
  }

  // Getter methods

  getPoints() {
    return this._points;
  }

  getColor() {
    return this._color;
  }

  getStrokeWidth() {
    return this._strokeWidth;
  }

  getFill() {
    return FILL_MODE;
  }

  getStrokeLinecap() {
    return STROKE_LINECAP_MODE;
  }

  getFilter() {
      return this._filter;
  }

  setColor(color: string) {
    this._color = color;
  }

  getPrimeColor(): string {
    return this.drawingToolService.PrimaryColor;
  }

  switchColor(): void {
    this.drawingToolService.switchColor();
  }
}
