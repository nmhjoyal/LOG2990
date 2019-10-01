import { HostListener, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { AppConstants } from 'src/AppConstants';

export abstract class DrawingToolsAbstract implements OnInit {
  points: string;
  private mouseDown = false;
  private strokeWidth: number = AppConstants.DEFAULT_STROKE_WIDTH;
  private color = 'black';
  private filter: string = AppConstants.DEFAULT_FILTER;
  private x: number;
  private y: number;

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  protected drawingToolService: LocalStorageService;

  constructor(serviceInstance: LocalStorageService) {
    this.drawingToolService = serviceInstance;
  }

  ngOnInit() {
    // empty block
  }

  // Abstract methods

  protected abstract saveShape(): void;

  // Event handling methods

  @HostListener('mousedown', ['$event']) onMouseDown(event: any) {
    this.mouseDown = true;
    this.points = event.offsetX + ',' + event.offsetY;
    this.x = event.offsetX;
    this.y = event.offsetY;
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: any) {
    if (this.mouseDown) {
      this.points += (' ' + event.offsetX + ',' + event.offsetY);
      this.saveShape();

    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: any) {

    if (this.x === event.offsetX && this.y === event.offsetY) {
      this.points += (' ' + (event.offsetX + 0.1) + ',' + (event.offsetY + 0.1));
    }
    this.mouseDown = false;
    this.saveShape();

    this.points = '';

  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: any) {
    if (this.mouseDown) {
      this.onMouseUp(event);
    }
  }

  // Functions

  increaseStrokeWidth() {
    this.strokeWidth++;
  }

  decreaseStrokeWidth() {
    if (this.strokeWidth > 1) {
      this.strokeWidth--;
    }
  }

  // Getter methods

  getPoints() {
    return this.points;
  }

  getColor() {
    return this.color;
  }

  getStrokeWidth() {
    return this.strokeWidth;
  }

  getFill() {
    return AppConstants.FILL_MODE;
  }

  getStrokeLinecap() {
    return AppConstants.STROKE_LINECAP_MODE;
  }

  getFilter() {
    return this.filter;
  }

  setColor(color: string) {
    this.color = color;
  }

  getPrimeColor(): string {
    return this.drawingToolService.PrimaryColor;
  }

  switchColor(): void {
    this.drawingToolService.switchColor();
  }
}
