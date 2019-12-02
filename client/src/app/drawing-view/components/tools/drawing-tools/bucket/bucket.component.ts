import { AfterViewInit, Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
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

export class BucketComponent extends ShapeAbstract implements OnInit, OnDestroy, AfterViewInit {

  private initialColour: number[];
  private toleranceOffset: number;
  private viewedPoints: number[][];
  private addedPoints: number[][];
  private tolerance: number;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;

  constructor( protected drawingStorage: SaveService, protected attributesService: AttributesService,
    public canvasData: CanvasInformationService, protected colourService: ColourService,
    public exportInformation: ExportInformationService, @Inject(CanvasComponent) protected canvasComponent: CanvasComponent) {
    super(drawingStorage, attributesService, colourService);
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasData.data.drawingWidth;
    this.canvas.height = this.canvasData.data.drawingHeight;
    this.toleranceOffset = ToolConstants.TOLERANCE_OFFSET;
    this.tolerance = ToolConstants.DEFAULT_TOLERANCE;
    this.viewedPoints = [];
    this.addedPoints = [];
    this.shape.id = Id.BUCKET;
    this.shape.points = '';
  }

  ngOnInit(): void {
    if (this.attributesService.bucketAttributes.wasSaved) {
      this.shape.strokeWidth = this.attributesService.bucketAttributes.savedStrokeWidth;
      // this.tolerance = this.attributesService.bucketAttributes.savedTolerance;
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

  @HostListener('mousedown', ['$event']) async onMouseDown(event: MouseEvent): Promise<void> {
    await this.initializeCanvas();
    this.initialColour = this.getColourAtPosition(ClickHelper.getXPosition(event), ClickHelper.getYPosition(event));
    console.log(ClickHelper.getXPosition(event), ClickHelper.getYPosition(event));
    console.log(this.initialColour);
    this.addSurroundingPixels(event.x, event.y);
    // console.log(this.viewedPoints);
    this.calculateDimensions();
    this.orderPoints();
    // console.log('Shape points' , this.addedPoints);
    console.log('Shape points' , this.shape.points);
  }

  onMouseUp(): void {
    this.saveShape();
    this.resetShape();
    this.shape.points = '';
    this.viewedPoints = [];
    this.addedPoints = [];
  }

  onMouseMove(): void {
    //
  }

  onMouseLeave(): void {
    //
  }

  protected acceptsColour(colour: number[]): boolean {
    return (Math.abs(colour[0] - this.initialColour[0]) < this.tolerance &&
            Math.abs(colour[1] - this.initialColour[1]) < this.tolerance &&
            Math.abs(colour[2] - this.initialColour[2]) < this.tolerance);
  }

  protected withinCanvas(position: number[]): boolean {
    return (position[0] > 0 && position[0] < this.canvas.width &&
            position[1] > 0 && position[1] < this.canvas.height);
  }

  protected isNewPoint(position: number[]): boolean {
    for (const viewedPoint of this.viewedPoints) {
      if (viewedPoint[0] === position[0] && viewedPoint[1] === position[1]) {
        return false;
      }
    }
    return true;
  }

  protected addSurroundingPixels(positionX: number, positionY: number): void {
    // this.viewedPoints = [];
    // this.addedPoints = [];
    // this.shape.points = '';
    const offset = 5;
    const stack: number[][] = [];
   // let position: number[];
    let position = [positionX, positionY];
    stack.push(position);
    let i = 0;
    while (stack.length > 0 && stack[i] ) {
      position = stack[i];
      let isBorderPoint = false;
      const up = this.getColourAtPosition(position[0], position[1] + offset);
      const right = this.getColourAtPosition(position[0] + offset, position[1]);
      const down = this.getColourAtPosition(position[0], position[1] - offset);
      const left = this.getColourAtPosition(position[0] - offset, position[1]);
      if (this.isNewPoint(position) && this.withinCanvas(position)) {
        this.viewedPoints.push(position);
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
      i++;
    }
    console.log(this.viewedPoints.length);
    /*

    const up = this.getColourAtPosition(positionX, positionY + offset);
    const right = this.getColourAtPosition(positionX + offset, positionY);
    const down = this.getColourAtPosition(positionX, positionY - offset);
    const left = this.getColourAtPosition(positionX - offset, positionY);
    if (this.isNewPoint(positionX, positionY) && this.withinCanvas(positionX, positionY)) {
      this.viewedPoints.push([positionX, positionY]);
      if (this.acceptsColor(up)) {
        this.addSurroundingPixels(positionX, positionY + offset);
      } else {
        this.addedPoints.push([positionX, positionY]);
      }
      if (this.acceptsColor(right)) {
        this.addSurroundingPixels(positionX + offset, positionY);
      } else {
        this.addedPoints.push([positionX, positionY]);
      }
      if (this.acceptsColor(down)) {
        this.addSurroundingPixels(positionX, positionY - offset);
      } else {
        this.addedPoints.push([positionX, positionY]);
      }
      if (this.acceptsColor(left)) {
        this.addSurroundingPixels(positionX - offset, positionY);
      } else {
        this.addedPoints.push([positionX, positionY]);
      }
    }*/
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
    } else { return ([]); }
  }
/*
  protected saveShape(): void {
    const currentDrawing: IShape = {
      id: this.shape.id,
      points: this.shape.points,
      primaryColour: this.shape.primaryColour,
      secondaryColour: this.shape.secondaryColour,
      x: this.shape.x,
      y: this.shape.y,
      width: this.shape.width,
      height: this.shape.height,
      strokeOpacity: this.shape.strokeOpacity,
      strokeWidth: this.shape.strokeWidth,
      fillOpacity: this.shape.fillOpacity,
    };
    this.drawingStorage.saveDrawing(currentDrawing);
  }
*/
  protected calculateDimensions(): void {
    let minWidth = Infinity;
    let maxWidth = 0;
    let minHeight = Infinity;
    let maxHeight = 0;
    for (const iterator of this.addedPoints) {
      if (iterator[0] < minWidth) { minWidth = iterator[0]; }
      if (iterator[0] > maxWidth) { maxWidth = iterator[0]; }
      if (iterator[1] < minHeight) { minHeight = iterator[1]; }
      if (iterator[1] < maxHeight) { maxHeight = iterator[1]; }
    }
    this.shape.width = maxWidth  - minWidth;
    this.shape.height = maxHeight  - minHeight;
    this.shape.x = (maxWidth + minWidth) / 2;
    this.shape.y = (maxHeight + minHeight) / 2;
    this.previewBox.width = this.shape.width;
    this.previewBox.height = this.shape.height;
    this.previewBox.x = this.shape.x;
    this.previewBox.y = this.shape.y;
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
