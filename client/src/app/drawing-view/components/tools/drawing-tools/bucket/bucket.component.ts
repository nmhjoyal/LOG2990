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
  private initialColour: string[];
  protected traceMode: number;
  private width: number;
  private height: number;
  private toleranceOffset: number;
 // private context: CanvasRenderingContext2D;
 // private canvas: ElementRef<HTMLCanvasElement>;
 // private svg: ElementRef<SVGImageElement>;

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
    // this.canvas = canvasComponent.htmlCanvas;
    // this.svg = canvasComponent.canvasChildComponent;
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


  @HostListener('click', ['$event']) onClick(event: MouseEvent): void {
    this.initializeCanvas();
    this.initialColour = this.getColourAtPosition(ClickHelper.getXPosition(event), ClickHelper.getYPosition(event));
    console.log(this.initialColour);
    // this.addSurroundingPixels(event.x, event.y);
  }

  protected acceptsColor(colour: string[]): boolean {
    return (Math.abs(Number(colour[0]) - Number(this.initialColour[0])) < this.tolerance &&
            Math.abs(Number(colour[1]) - Number(this.initialColour[1])) < this.tolerance &&
            Math.abs(Number(colour[2]) - Number(this.initialColour[2])) < this.tolerance);
  }

  protected withinCanvas(positionX: number, positionY: number): boolean {
    return (positionX > 0 && positionX < this.canvas.width &&
            positionY > 0 && positionY < this.canvas.height);
  }

  protected addSurroundingPixels(positionX: number, positionY: number): void {
    const up = this.getColourAtPosition(positionX, positionY + this.toleranceOffset);
    const right = this.getColourAtPosition(positionX + this.toleranceOffset, positionY);
    const down = this.getColourAtPosition(positionX, positionY - this.toleranceOffset);
    const left = this.getColourAtPosition(positionX - this.toleranceOffset, positionY);

    console.log(this.shape.points);
    if (this.acceptsColor(up) && this.withinCanvas(positionX, positionY)) {
      this.addSurroundingPixels(positionX, positionY + this.toleranceOffset);
    } else {
      this.shape.points += positionX + ',' + positionY;
    }
    if (this.acceptsColor(right) && this.withinCanvas(positionX, positionY)) {
      this.addSurroundingPixels(positionX + this.toleranceOffset, positionY);
    } else {
      this.shape.points += positionX + ',' + positionY;
    }
    if (this.acceptsColor(down) && this.withinCanvas(positionX, positionY)) {
      this.addSurroundingPixels(positionX, positionY - this.toleranceOffset);
    } else {
      this.shape.points += positionX + ',' + positionY;
    }
    if (this.acceptsColor(left) && this.withinCanvas(positionX, positionY)) {
      this.addSurroundingPixels(positionX - this.toleranceOffset, positionY);
    } else {
      this.shape.points += positionX + ',' + positionY;
    }
  }

  initializeCanvas(): void {
    const img = new Image();
    img.width = this.width;
    img.height = this.height;
    this.context = this.canvas.getContext('2d');
    const data = (new XMLSerializer()).serializeToString(this.exportInformation.data.canvasElement.nativeElement as Node);
    img.src = 'data:image/svg+xml,' + window.btoa(data);
    if (this.context) {
      this.context.drawImage(img, 0, 0, this.width, this.height);
    }

/*
    let svg = document.getElementsByTagName('svg')[0];
    let svg_xml = (new XMLSerializer()).serializeToString(svg);
    let blob = new Blob([svg_xml], {type:'image/svg+xml;charset=utf-8'});
    let url = window.URL.createObjectURL(blob);

    var ctx = canvas.getContext('2d');
    this.context.drawImage(img, 0, 0, 730, 300);

    window.URL.revokeObjectURL(url);
    var canvasdata = canvas.toDataURL('image/png');
    var a = document.getElementById('imgId');
    a.download = "export_" + Date.now() + ".png";
    a.href=canvasdata;   */

    // const data = this.xmlToBase64();
    // this.drawImage(data);
  }
/*
  xmlToBase64(): string {
    this.context = this.canvas.getContext('2d');
    const data = (new XMLSerializer()).serializeToString(this.exportInformation.data.canvasElement.nativeElement as Node);
    return 'data:image/svg+xml;base64,' + window.btoa(data);
  }

  drawImage(data: string): void {
    const img = new Image();
    img.width = this.width;
    img.height = this.height;
    img.src = data;
    if (this.context) {
      this.context.drawImage(img, 0, 0);
    }
  }

  draw3Image(data: string): void {
    const img = new Image();
    img.width = this.width;
    img.height = this.height;
    img.src = data;
    img.addEventListener('load', () => {
      if (this.context) {
        this.context.drawImage(img, 0, 0);
        const a = document.createElement('a');
        a.download = this.name;
        a.href = this.canvas.toDataURL('image/', 1.0);
        a.click();
      }
    });
  }
*/
  getColourAtPosition(x: number, y: number): string[] {
    if (this.context) {
      const imageData = this.context.getImageData(x, y, 1, 1).data;
      let arrayIndex = 0;
      const r = this.colourService.rgbToHex(imageData[arrayIndex]);
      const g = this.colourService.rgbToHex(imageData[++arrayIndex]);
      const b = this.colourService.rgbToHex(imageData[++arrayIndex]);
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
