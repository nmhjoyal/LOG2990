import { HostListener, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { IDrawingTool } from './drawing-tool-interface';

export abstract class DrawingToolsAbstract implements OnInit {

  protected stroke: IDrawingTool;
  private mouseDown: boolean;
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

  protected saveShape(): void {
    this.drawingToolService.stack.push(this.stroke);
  }

  // Event handling methods

  @HostListener('mousedown', ['$event']) onMouseDown(event: any) {
    this.mouseDown = true;
    this.stroke.points = event.offsetX + ',' + event.offsetY;
    this.x = event.offsetX;
    this.y = event.offsetY;
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: any) {
    if (this.mouseDown) {
      this.stroke.points += (' ' + event.offsetX + ',' + event.offsetY);
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: any) {

    if (this.x === event.offsetX && this.y === event.offsetY) {
      this.stroke.points += (' ' + (event.offsetX + 0.1) + ',' + (event.offsetY + 0.1));
    }
    this.saveShape();
    this.mouseDown = false;
    this.stroke.points = '';
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: any) {
    if (this.mouseDown) {
      this.onMouseUp(event);
    }
  }

  // Functions

  increaseStrokeWidth(): void {
    this.stroke.strokeWidth++;
  }

  decreaseStrokeWidth(): void {
    if (this.stroke.strokeWidth > 1) {
      this.stroke.strokeWidth--;
    }
  }
}
