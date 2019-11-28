import { Component, HostListener, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { ExportInformationService } from 'src/app/services/export-information/export-information.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { CanvasComponent } from '../../../canvas/canvas.component';
import { ShapeAbstract } from '../../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { Id, ToolConstants } from '../../assets/constants/tool-constants';
import { IShape } from '../../assets/interfaces/shape-interface';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss'],
})

export class BucketComponent extends ShapeAbstract implements OnInit, OnDestroy {

  @Input() windowHeight: number;
  @Input() windowWidth: number;
  shape: IShape;
  private tolerance: number;
  private initialColour: number[];
  protected traceMode: number;
  private width: number;
  private height: number;
  private toleranceOffset: number;
  private viewedPoints: string[];
  private addedPoints: string[];

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  protected name: string;

  constructor( protected drawingStorage: SaveService, protected attributesService: AttributesService,
    public canvasData: CanvasInformationService, protected colourService: ColourService,
    public exportInformation: ExportInformationService, @Inject(CanvasComponent) protected canvasComponent: CanvasComponent) {
    super(drawingStorage, attributesService, colourService);
    this.width = this.canvasData.data.drawingWidth;
    this.height = this.canvasData.data.drawingHeight;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.tolerance = ToolConstants.DEFAULT_TOLERANCE;
    this.toleranceOffset = ToolConstants.TOLERANCE_OFFSET;
    this.traceMode = ToolConstants.TRACE_MODE.CONTOUR_FILL;
    this.viewedPoints = [];
    this.addedPoints = [];
    this.shape = {
      id: Id.BUCKET,
      primaryColour: colourService.PrimaryColour,
      secondaryColour: colourService.SecondaryColour,
      x: ToolConstants.NULL,
      y: ToolConstants.NULL,
      width: 0,
      height: 0,
      strokeOpacity: ToolConstants.DEFAULT_OPACITY,
      strokeWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
      fillOpacity: ToolConstants.DEFAULT_OPACITY,
      points: '',
    };
  }

  saveAttribute(): void {
    this.attributesService.bucketAttributes.wasSaved = true;
    this.attributesService.bucketAttributes.savedStrokeWidth = this.shape.strokeWidth;
    this.attributesService.bucketAttributes.savedTolerance = this.tolerance;
    this.attributesService.bucketAttributes.savedTraceMode = this.traceMode;
  }

  ngOnInit(): void {
    if (this.attributesService.bucketAttributes.wasSaved) {
      this.shape.strokeWidth = this.attributesService.bucketAttributes.savedStrokeWidth;
      this.tolerance = this.attributesService.bucketAttributes.savedTolerance;
      this.traceMode = this.attributesService.polygonAttributes.savedTraceMode;
    }
  }

  ngOnDestroy(): void {
    this.attributesService.polygonAttributes.savedTraceMode = this.traceMode;
    this.saveAttribute();
  }

  @HostListener('click', ['$event']) async onClick(event: MouseEvent): Promise<void> {
    await this.initializeCanvas();
    this.initialColour = this.getColourAtPosition(ClickHelper.getXPosition(event), ClickHelper.getYPosition(event));
    console.log(ClickHelper.getXPosition(event), ClickHelper.getYPosition(event));
    console.log(this.initialColour);
    this.addSurroundingPixels(event.x, event.y);
    console.log(this.viewedPoints);
    console.log(this.shape.points);

  }

  protected acceptsColor(colour: number[]): boolean {
    return (Math.abs(colour[0] - this.initialColour[0]) < this.tolerance &&
            Math.abs(colour[1] - this.initialColour[1]) < this.tolerance &&
            Math.abs(colour[2] - this.initialColour[2]) < this.tolerance);
  }

  protected withinCanvas(positionX: number, positionY: number): boolean {
    return (positionX > 0 && positionX < this.width &&
            positionY > 0 && positionY < this.height);
  }

  protected isNewPoint(positionX: number, positionY: number): boolean {
    for (const iterator of this.viewedPoints) {
      if (iterator === (positionX + ',' + positionY).toString()) {
        return false;
      }
    }
    return true;
  }

  protected addSurroundingPixels(positionX: number, positionY: number): void {
    const offset = 5;
    const up = this.getColourAtPosition(positionX, positionY + offset);
    const right = this.getColourAtPosition(positionX + offset, positionY);
    const down = this.getColourAtPosition(positionX, positionY - offset);
    const left = this.getColourAtPosition(positionX - offset, positionY);
    if (this.withinCanvas(positionX, positionY) && this.isNewPoint(positionX, positionY)) {
      this.viewedPoints.push(positionX + ',' + positionY);
      if (this.acceptsColor(up)) {
        this.addSurroundingPixels(positionX, positionY + offset);
      }
      if (this.acceptsColor(right)) {
        this.addSurroundingPixels(positionX + offset, positionY);
      }
      if (this.acceptsColor(down)) {
        this.addSurroundingPixels(positionX, positionY - offset);
      }
      if (this.acceptsColor(left)) {
        this.addSurroundingPixels(positionX - offset, positionY);
      }
    } else {
      this.addedPoints.push(positionX + ',' + positionY);
     // this.shape.points += ' ' + positionX + ',' + positionY;
  }

  }

  async initializeCanvas(): Promise<void> {
    const img = new Image();
    img.width = this.width;
    img.height = this.height;
    this.context = this.canvas.getContext('2d');
    const data = (new XMLSerializer()).serializeToString(this.exportInformation.data.canvasElement.nativeElement as Node);
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(data)}`;
    if (this.context) {
      this.context.drawImage(img, 0, 0, this.width, this.height);
    }
  }
  getColourAtPosition(x: number, y: number): number[] {
    if (this.context) {
      const imageData = this.context.getImageData(x, y, 1, 1).data;
      let arrayIndex = 0;
      const r = imageData[arrayIndex];
      const g = imageData[++arrayIndex];
      const b = imageData[++arrayIndex];
      return ([r, g, b]);
    } else { return ([]); }
  }

  increaseTolerance(): void {
    if (this.tolerance <= 1 - ToolConstants.TOLERANCE_OFFSET) {
      this.tolerance += this.toleranceOffset;
    }
  }

  decreaseTolerance(): void {
    if (this.tolerance >= ToolConstants.TOLERANCE_OFFSET) {
      this.tolerance -= this.toleranceOffset;
    }
  }
}
