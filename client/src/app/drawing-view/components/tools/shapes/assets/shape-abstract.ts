import { HostListener, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';

const DEFAULT_OPACITY = 1;
const DEFAULT_STROKE_WIDTH = 2;
const CONTOUR_MODE = 1;
const FILL_MODE = 2;
const CONTOUR_FILL_MODE = 3;

export abstract class ShapeAbstract implements OnInit {
  protected cursorX: number;
  protected cursorY: number;
  protected previewWidth: number;
  protected previewHeight: number;
  protected strokeOpacity: number = DEFAULT_OPACITY;
  protected fillOpacity: number = DEFAULT_OPACITY;
  protected strokeWidth: number = DEFAULT_STROKE_WIDTH;
  protected shapeHeight = 0;
  protected shapeWidth = 0;
  protected x = 0;
  protected y = 0;
  protected shapeX = 0;
  protected shapeY = 0;
  protected mouseDown = false;
  protected shiftDown = false;

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  protected shapeService: LocalStorageService;

  constructor(serviceInstance: LocalStorageService) {
    this.shapeService = serviceInstance;
  }

  ngOnInit() {
    // empty body
  }

  // Abstract methods

  protected abstract saveShape(): void;
  protected abstract calculateDimensions(): void;

  // Event handling methods

  @HostListener('mousedown', ['$event']) onMouseDown(event: any): void {
    this.x = event.offsetX;
    this.y = event.offsetY;
    this.mouseDown = true;
  }

  @HostListener('mouseup') onMouseUp(): void {
    this.mouseDown = false;

    if (!(this.shapeHeight === 0 && this.shapeWidth === 0)) {
      this.saveShape();
    }

    this.shapeHeight = 0;
    this.shapeWidth = 0;
    this.previewHeight = 0;
    this.previewWidth = 0;
    this.x = 0;
    this.y = 0;
  }

  @HostListener('mouseleave') onMouseleave(): void {
    if (this.mouseDown) {
      this.onMouseUp();
    }
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: any): void {
    this.cursorX = event.offsetX;
    this.cursorY = event.offsetY;

    if (this.mouseDown) {
      this.previewWidth = event.offsetX - this.x;
      this.previewHeight = event.offsetY - this.y;
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

  decreaseStrokeWidth(): void {
    if (this.strokeWidth !== 0) {
      this.strokeWidth--;
    }
  }

  increaseStrokeWidth(): void {
    this.strokeWidth++;
  }

  setTraceMode(mode: number): void {
    switch (mode) {
      case CONTOUR_MODE:
        this.strokeOpacity = 1; // load from color service
        this.fillOpacity = 0;
        break;

      case FILL_MODE:
        this.strokeOpacity = 0;
        this.fillOpacity = 1; // load from color service
        break;

      case CONTOUR_FILL_MODE:
          this.strokeOpacity = 1; // load from color service
          this.fillOpacity = 1; // load from color service
          break;

      default:
        break;
    }

  }

  // Getter methods

  get X(): number {
    return this.x;
  }

  get Y(): number {
    return this.y;
  }

  get ShapeX(): number {
    return this.shapeX;
  }

  get ShapeY(): number {
    return this.shapeY;
  }

  get PreviewWidth(): number {
    return this.previewWidth;
  }

  get PreviewHeight(): number {
    return this.previewHeight;
  }

  get ShapeWidth(): number {
    return this.shapeWidth;
  }

  get ShapeHeight(): number {
    return this.shapeHeight;
  }

  get StrokeWidth(): number {
    return this.strokeWidth;
  }

  get StrokeOpacity(): number {
    return this.strokeOpacity;
  }

  get FillOpacity(): number {
    return this.fillOpacity;
  }

  getPrimeColor(): string {
    return this.shapeService.PrimaryColor;
  }

  getSecondColor(): string {
    return this.shapeService.SecondColor;
  }
}
