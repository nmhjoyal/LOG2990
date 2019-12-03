import { AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { ExportInformationService } from 'src/app/services/export-information/export-information.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { ShapeAbstract } from '../../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { Id, ToolConstants } from '../../assets/constants/tool-constants';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss'],
})

export class BucketComponent extends ShapeAbstract implements OnInit, OnDestroy, AfterViewInit {

  private initialColour: number[];
  private viewedPoints: Set<string>;
  private addedPoints: number[][];
  private tolerance: number;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;

  constructor( protected drawingStorage: SaveService, protected attributesService: AttributesService,
    public canvasData: CanvasInformationService, protected colourService: ColourService,
    public exportInformation: ExportInformationService) {
    super(drawingStorage, attributesService, colourService);
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasData.data.drawingWidth;
    this.canvas.height = this.canvasData.data.drawingHeight;
    this.tolerance = ToolConstants.DEFAULT_TOLERANCE;
    this.viewedPoints = new Set();
    this.addedPoints = [];
    this.shape.id = Id.BUCKET;
    this.shape.points = '';
    this.shape.strokeLinecap = ToolConstants.ROUND;
    this.shape.strokeLinejoin = ToolConstants.ROUND;
  }

  ngOnInit(): void {
    if (this.attributesService.bucketAttributes.wasSaved) {
      this.shape.strokeWidth = this.attributesService.bucketAttributes.savedStrokeWidth;
      this.tolerance = this.attributesService.bucketAttributes.savedTolerance;
      this.traceMode = this.attributesService.bucketAttributes.savedTraceMode;
    }
    this.setTraceMode(this.traceMode);
    this.colourService.data.subscribe((colour: string[]) => {
      this.shape.primaryColour = colour[0];
      this.shape.secondaryColour = colour[1];
    });
  }

  ngOnDestroy(): void {
    this.attributesService.bucketAttributes.wasSaved = true;
    this.attributesService.bucketAttributes.savedStrokeWidth = this.shape.strokeWidth;
    this.attributesService.bucketAttributes.savedTolerance = this.tolerance;
    this.attributesService.bucketAttributes.savedTraceMode = this.traceMode;
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
  }

  async onMouseDown(event: MouseEvent): Promise<void> {
    await this.initializeCanvas();
    this.initialColour = this.getColourAtPosition(ClickHelper.getXPosition(event), ClickHelper.getYPosition(event));
    this.addSurroundingPixels(event.x, event.y);
    this.calculateDimensions();
    this.orderPoints();
  }

  onMouseUp(): void {
    this.saveShape();
    this.resetShape();
    this.shape.points = '';
    this.viewedPoints = new Set();
    this.addedPoints = [];
  }

  protected saveShape(): void {
    if (this.shape.points !== '') {
      super.saveShape();
    }
  }

  onMouseMove(): void {
    //
  }

  onMouseLeave(): void {
    //
  }

  protected acceptsColour(colour: number[]): boolean {
    return (Math.abs(colour[0] - this.initialColour[0]) <= this.tolerance &&
            Math.abs(colour[1] - this.initialColour[1]) <= this.tolerance &&
            Math.abs(colour[2] - this.initialColour[2]) <= this.tolerance);
  }

  protected withinCanvas(position: number[]): boolean {
    return (position[0] > 0 && position[0] < this.canvas.width &&
            position[1] > 0 && position[1] < this.canvas.height);
  }

  protected isNewPoint(size: number): boolean {
    return !(this.viewedPoints.size === size);
  }

  protected addSurroundingPixels(positionX: number, positionY: number): void {
    this.viewedPoints = new Set();
    // this.addedPoints = [];
    // this.shape.points = '';
    const offset = 5;
    const stack: number[][] = new Array<[]>();
   // let position: number[];
    let position = [positionX, positionY];
    stack.push(position);
    while (stack.length > 0) {
      // tslint:disable-next-line: no-non-null-assertion
      position = stack.pop()!;
      let isBorderPoint = false;
      const up = this.getColourAtPosition(position[0], position[1] + offset);
      const right = this.getColourAtPosition(position[0] + offset, position[1]);
      const down = this.getColourAtPosition(position[0], position[1] - offset);
      const left = this.getColourAtPosition(position[0] - offset, position[1]);
      const size = this.viewedPoints.size;
      this.viewedPoints.add(position[0] + '' + position[1]);
      if (this.isNewPoint(size) && this.withinCanvas(position)) {
        if (this.acceptsColour(up)) {
          stack.push([position[0], position[1] + offset]);
        } else {
          isBorderPoint = true;
        }
        if (this.acceptsColour(right)) {
          stack.push([position[0] + offset, position[1]]);
        } else {
          isBorderPoint = true;
        }
        if (this.acceptsColour(down)) {
          stack.push([position[0], position[1] - offset]);
        } else {
          isBorderPoint = true;
        }
        if (this.acceptsColour(left)) {
          stack.push([position[0] - offset, position[1]]);
        } else {
          isBorderPoint = true;
        }
        if (isBorderPoint) {
          this.addedPoints.push([position[0], position[1]]);
        }
      }
    }
  }

  async initializeCanvas(): Promise<void> {
    const img = new Image();
    img.width = this.canvas.width;
    img.height = this.canvas.height;
    this.context = this.canvas.getContext('2d');
    const data = (new XMLSerializer()).serializeToString(this.exportInformation.data.canvasElement.nativeElement as Node);
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(data)}`;
    if (this.context) {
      this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  orderPoints(): void {
    let lastPoint = this.addedPoints[0];
    const firstPoint = lastPoint;
    this.addedPoints.splice(0, 1);
    this.shape.points += firstPoint[0] + ',' + firstPoint[1] + ' ';
    while (this.addedPoints.length) {
      const nearestIndex = this.findNearestIndex(lastPoint);
      lastPoint = this.addedPoints[nearestIndex];
      this.addedPoints.splice(nearestIndex, 1);
      this.shape.points += lastPoint[0] + ',' + lastPoint[1] + ' ';
    }
    this.shape.points += firstPoint[0] + ',' + firstPoint[1] + ' ';
  }

  findNearestIndex(point: number[]): number {
    let nearestDistance = Infinity;
    let nearestIndex = 0;
    for (let i = 0; i < this.addedPoints.length; i++) {
      const point2 = this.addedPoints[i];
      const distance = (point[0] - point2[0]) * (point[0] - point2[0])
                     + (point[1] - point2[1]) * (point[1] - point2[1]);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }
    return nearestIndex;
  }

  getColourAtPosition(x: number, y: number): number[] {
    if (this.context) {
      const imageData = this.context.getImageData(x, y, 1, 1).data;
      let arrayIndex = 0;
      const r = imageData[arrayIndex];
      const g = imageData[++arrayIndex];
      const b = imageData[++arrayIndex];
      return ([r, g, b]);
    } else {
      return ([]); }
  }

  protected calculateDimensions(): void {
    let minWidth = Infinity;
    let maxWidth = 0;
    let minHeight = Infinity;
    let maxHeight = 0;
    for (const point of this.addedPoints) {
      if (point[0] < minWidth) { minWidth = point[0]; }
      if (point[0] > maxWidth) { maxWidth = point[0]; }
      if (point[1] < minHeight) { minHeight = point[1]; }
      if (point[1] > maxHeight) { maxHeight = point[1]; }
    }
    this.shape.width = maxWidth - minWidth;
    this.shape.height = maxHeight - minHeight;
    this.shape.x = minWidth;
    this.shape.y = minHeight;
    this.previewBox.width = this.shape.width;
    this.previewBox.height = this.shape.height;
    this.previewBox.x = this.shape.x;
    this.previewBox.y = this.shape.y;
  }
}
