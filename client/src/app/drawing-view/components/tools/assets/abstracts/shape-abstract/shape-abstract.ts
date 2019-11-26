import { HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { IPreviewBox, IShape } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { AttributesService } from '../../attributes/attributes.service';
import { ToolAbstract } from '../tool-abstract/tool-abstract';

export abstract class ShapeAbstract extends ToolAbstract implements OnInit, OnDestroy {
  protected initialX: number;
  protected initialY: number;
  protected cursorX: number;
  protected cursorY: number;
  protected mouseDown: boolean;
  protected shiftDown: boolean;
  protected previewBox: IPreviewBox;
  protected shape: IShape;
  protected traceMode: number;
  protected colourSubscription: Subscription;

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  constructor(protected saveService: SaveService,
              protected attributesService: AttributesService,
              protected colourService: ColourService) {
    super();
    this.mouseDown = false;
    this.shiftDown = false;
    this.initialX = 0;
    this.initialY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.traceMode = ToolConstants.TRACE_MODE.CONTOUR_FILL;
    this.previewBox = {
      x: 0,
      y: 0,
      width: 0,
      height: 0, };
    this.shape = {
      id: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      verticesNumber: 0,
      vertices: '',
      primaryColour: this.colourService.PrimaryColour,
      secondaryColour: this.colourService.SecondaryColour,
      strokeOpacity: this.colourService.SecondaryOpacity,
      strokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      fillOpacity: this.colourService.PrimaryOpacity,
    };
  }

   ngOnInit(): void {
    this.colourSubscription =
    this.colourService.colourObservable.subscribe((colour: string[]) => {
      this.shape.primaryColour = colour[0];
      this.shape.secondaryColour = colour[1];
    });
  }

  ngOnDestroy(): void {
    this.colourSubscription.unsubscribe();
  }

  // Event handling methods

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.initialX = ClickHelper.getXPosition(event);
    this.initialY = ClickHelper.getYPosition(event);
    this.mouseDown = true;
  }

  @HostListener('mouseup') onMouseUp(): void {

    if (this.mouseDown && (this.shape.height > 0 && this.shape.width > 0)) {
      this.saveShape();
    }

    this.resetShape();
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    if (this.mouseDown) {
      this.onMouseUp();
    }
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    this.cursorX = ClickHelper.getXPosition(event);
    this.cursorY = ClickHelper.getYPosition(event);

    if (this.mouseDown) {
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

  protected decreaseStrokeWidth(): void {
    if (this.shape.strokeWidth !== 0) {
      this.shape.strokeWidth--;
    }
  }

  protected increaseStrokeWidth(): void {
    this.shape.strokeWidth++;
  }

  protected setTraceMode(mode: number): void {
    switch (mode) {
      case ToolConstants.TRACE_MODE.CONTOUR:
        this.shape.secondaryColour = this.colourService.SecondaryColour;
        this.shape.primaryColour = ToolConstants.NONE;
        this.traceMode = ToolConstants.TRACE_MODE.CONTOUR;
        break;

      case ToolConstants.TRACE_MODE.FILL:
        this.shape.secondaryColour = this.shape.primaryColour;
        this.shape.primaryColour = this.colourService.PrimaryColour;
        this.traceMode = ToolConstants.TRACE_MODE.FILL;
        break;

      case ToolConstants.TRACE_MODE.CONTOUR_FILL:
        this.shape.secondaryColour = this.colourService.SecondaryColour;
        this.shape.primaryColour = this.colourService.PrimaryColour;
        this.traceMode = ToolConstants.TRACE_MODE.CONTOUR_FILL;
        break;

      default:
        break;
    }

  }

  protected calculateDimensions(): void {
    this.previewBox.x = this.cursorX < this.initialX ? this.cursorX : this.initialX;
    this.previewBox.y = this.cursorY < this.initialY ? this.cursorY : this.initialY;
    this.previewBox.width = Math.abs(this.cursorX - this.initialX);
    this.previewBox.height = Math.abs(this.cursorY - this.initialY);
  }

  protected saveShape(): void {
    const currentDrawing: IShape = {
      id: this.shape.id,
      x: this.shape.x,
      y: this.shape.y,
      width: this.shape.width,
      height: this.shape.height,
      verticesNumber: this.shape.verticesNumber,
      vertices: this.shape.vertices,
      primaryColour: this.shape.primaryColour,
      secondaryColour: this.shape.secondaryColour,
      strokeOpacity: this.shape.strokeOpacity,
      strokeWidth: this.shape.strokeWidth,
      fillOpacity: this.shape.fillOpacity,
    };
    this.saveService.saveDrawing(currentDrawing);
  }

  protected resetShape(): void {
    this.mouseDown = false;
    this.shape.height = 0;
    this.shape.width = 0;
    this.previewBox.height = 0;
    this.previewBox.width = 0;
    this.previewBox.x = 0;
    this.previewBox.y = 0;
    this.initialY = 0;
    this.initialX = 0;
  }

}
