import { HostListener, Input, OnInit, OnDestroy} from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { IDrawingTool } from '../../interfaces/drawing-tool-interface';
import { AttributesService } from '../../attributes/attributes.service';
import { ToolConstants } from '../../tool-constants';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolAbstract } from '../tool-abstract/tool-abstract';


export abstract class StrokeAbstract extends ToolAbstract implements OnInit, OnDestroy {

  protected stroke: IDrawingTool;
  private mouseDown: boolean;
  private x: number;
  private y: number;

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  constructor(protected toolService: ToolHandlerService, 
              protected attributesService: AttributesService,
              protected colorService: ColorService) {
    super();
    this.stroke = {
    id: '',
    points: '',
    color: colorService.color[0],
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
  abstract saveAttribute(): void;


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

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.stroke.points = event.offsetX + ',' + event.offsetY;
    this.x = event.offsetX;
    this.y = event.offsetY;
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      this.stroke.points += (' ' + event.offsetX + ',' + event.offsetY);
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent): void {

    if (this.x === event.offsetX && this.y === event.offsetY) {
      this.stroke.points += (' ' + (event.offsetX + 0.1) + ',' + (event.offsetY + 0.1));
    }
    this.saveShape();
    this.mouseDown = false;
    this.stroke.points = '';
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent): void {
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
