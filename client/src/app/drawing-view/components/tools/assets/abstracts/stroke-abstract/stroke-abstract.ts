import { HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../../attributes/attributes.service';
import { ToolConstants } from '../../constants/tool-constants';
import { IDrawingTool } from '../../interfaces/drawing-tool-interface';
import { ToolAbstract } from '../tool-abstract/tool-abstract';

export abstract class StrokeAbstract extends ToolAbstract implements OnInit, OnDestroy {

  protected stroke: IDrawingTool;
  protected mouseDown: boolean;
  private x: number;
  private y: number;
  private colourSubscription: Subscription;

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  constructor(protected drawingStorage: SaveService,
              protected attributesService: AttributesService,
              protected colourService: ColourService) {
    super();
    this.stroke = {
    id: '',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    points: '',
    colour: colourService.PrimaryColour,
    strokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
    fill: ToolConstants.NONE,
    strokeLinecap: ToolConstants.ROUND,
    strokeLinejoin: ToolConstants.ROUND,
    filter: ToolConstants.NONE, };
    this.mouseDown = false;
    this.x = 0;
    this.y = 0;
  }

  ngOnInit(): void {
    this.colourSubscription =
    this.colourService.colourObservable.subscribe((colour: string[]) => {
      this.stroke.colour = colour[0];
    });
  }

  ngOnDestroy(): void {
    this.colourSubscription.unsubscribe();
  }

  abstract saveAttribute(): void;

  protected saveShape(): void {
    const currentDrawing: IDrawingTool = {
      id: this.stroke.id,
      points: this.stroke.points,
      x: this.stroke.x,
      y: this.stroke.y,
      width: this.stroke.width,
      height: this.stroke.height,
      colour: this.stroke.colour,
      strokeWidth: this.stroke.strokeWidth,
      fill: this.stroke.fill,
      strokeLinecap: this.stroke.strokeLinecap,
      strokeLinejoin: this.stroke.strokeLinejoin,
      filter: this.stroke.filter,
    };
    this.drawingStorage.saveDrawing(currentDrawing);
  }

  // Event handling methods

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.stroke.points = ClickHelper.getXPosition(event) + ',' + ClickHelper.getYPosition(event);
    this.x = ClickHelper.getXPosition(event);
    this.y = ClickHelper.getYPosition(event);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      this.stroke.points += (' ' + ClickHelper.getXPosition(event) + ',' + ClickHelper.getYPosition(event));
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent): void {

    if (this.x === ClickHelper.getXPosition(event) && this.y === ClickHelper.getYPosition(event)) {
      this.stroke.points += (' ' + (ClickHelper.getXPosition(event)) + ',' + (ClickHelper.getYPosition(event)));
    }
    this.getPositionAndDimensions();
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

  protected getPositionAndDimensions(): void {
    if (this.stroke.points !== undefined) {
      const pointsList = this.stroke.points.split(' ');
      this.stroke.x = this.windowWidth;
      this.stroke.y = this.windowHeight;
      this.stroke.width = 0;
      this.stroke.height = 0;
      for (const point of pointsList) {
        const coordinates = point.split(',');
        this.stroke.x = Number(coordinates[0].trim()) < this.stroke.x ? Number(coordinates[0].trim()) : this.stroke.x;
        this.stroke.width = Number(coordinates[0].trim()) > this.stroke.width ? Number(coordinates[0].trim()) : this.stroke.width;
        if (coordinates.length > 1) {
          this.stroke.y = Number(coordinates[1].trim()) < this.stroke.y ? Number(coordinates[1].trim()) : this.stroke.y;
          this.stroke.height = Number(coordinates[1].trim()) > this.stroke.height ? Number(coordinates[1].trim()) : this.stroke.height;
        }
      }
      this.stroke.width = this.stroke.width - this.stroke.x;
      this.stroke.height = this.stroke.height - this.stroke.y;
    }
  }
}
