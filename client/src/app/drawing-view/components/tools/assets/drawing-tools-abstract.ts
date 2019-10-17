import { HostListener, Input, OnInit, OnDestroy} from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { IDrawingTool } from './interfaces/drawing-tool-interface';
import { ToolConstants } from './tool-constants';
import { AttributesService } from './attributes/attributes.service';

export abstract class DrawingToolsAbstract implements OnInit, OnDestroy {

  protected stroke: IDrawingTool;
  private mouseDown: boolean;
  private x: number;
  private y: number;

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  constructor(protected toolService: ToolHandlerService, protected attributesService: AttributesService) {
    this.stroke = {
    id: '',
    points: '',
    color: 'blue',
    strokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
    fill: ToolConstants.NONE,
    strokeLinecap: ToolConstants.ROUND,
    strokeLinejoin: ToolConstants.ROUND,
    filter: ToolConstants.NONE, };
    this.mouseDown = false;
    this.x = 0;
    this.y = 0;
  }

  abstract ngOnInit(): void;  
  abstract ngOnDestroy(): void;


  protected saveShape(): void {
    const currentDrawing: IDrawingTool = {
      id: this.stroke.id,
      points: this.stroke.points,
      color: this.stroke.color,
      strokeWidth: this.stroke.strokeWidth,
      fill: this.stroke.fill,
      strokeLinecap: this.stroke.strokeLinecap,
      strokeLinejoin: this.stroke.strokeLinejoin,
      filter: this.stroke.filter,
    };
    this.toolService.drawings.push(currentDrawing);
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

  protected increaseStrokeWidth(): void {
    this.stroke.strokeWidth++;
  }

  protected decreaseStrokeWidth(): void {
    if (this.stroke.strokeWidth > 1) {
      this.stroke.strokeWidth--;
    }
  }
}
