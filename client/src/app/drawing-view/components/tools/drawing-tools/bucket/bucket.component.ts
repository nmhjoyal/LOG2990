import { Component, ElementRef, HostListener, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { CanvasComponent } from '../../../canvas/canvas.component';
import { ToolAbstract } from '../../assets/abstracts/tool-abstract/tool-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { Id, ToolConstants } from '../../assets/constants/tool-constants';
import { IShape } from '../../assets/interfaces/shape-interface';
import { MatDialogRef } from '@angular/material';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ExportInformationService } from 'src/app/services/export-information/export-information.service';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss'],
})

export class BucketComponent extends ToolAbstract implements OnInit, OnDestroy {

  @Input() protected windowHeight: number;
  @Input() protected windowWidth: number;
  private shape: IShape;
  private tolerance: number;
  private initialColour: string;
  protected traceMode: number;
  private width: number;
  private height: number;
 // private context: CanvasRenderingContext2D;
 // private canvas: ElementRef<HTMLCanvasElement>;
  private svg: ElementRef<SVGImageElement>;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  protected name: string;

  constructor(public canvasData: CanvasInformationService, protected colourService: ColourService,
    public exportInformation: ExportInformationService) {
    super();
    if (this.canvasData) {
      this.width = this.canvasData.data.drawingWidth;
      this.height = this.canvasData.data.drawingHeight;
    }
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
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
  }/*

  constructor( protected drawingStorage: SaveService, protected attributesService: AttributesService,
    protected colourService: ColourService, @Inject(CanvasComponent) protected canvasComponent: CanvasComponent) {
    super();
    this.tolerance = ToolConstants.DEFAULT_TOLERANCE;
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
    this.canvas = canvasComponent.htmlCanvas;
    this.svg = canvasComponent.canvasChildComponent;
  }
*//*
  saveAttribute(): void {
    this.attributesService.bucketAttributes.wasSaved = true;
    this.attributesService.bucketAttributes.savedStrokeWidth = this.shape.strokeWidth;
    this.attributesService.bucketAttributes.savedTolerance = this.tolerance;
    this.attributesService.bucketAttributes.savedTraceMode = this.traceMode;
  }
*/
  ngOnInit(): void {/*
    if (this.attributesService.bucketAttributes.wasSaved) {
      this.shape.strokeWidth = this.attributesService.bucketAttributes.savedStrokeWidth;
      this.tolerance = this.attributesService.bucketAttributes.savedTolerance;
      this.traceMode = this.attributesService.polygonAttributes.savedTraceMode;
    }*/
  }

  ngOnDestroy(): void {/*
    this.attributesService.polygonAttributes.savedTraceMode = this.traceMode;
    this.saveAttribute();*/
  }

  ngAfterViewInit() {

    /*
    // get svg data
    const xml = new XMLSerializer().serializeToString(this.svg as Node);

    // make it base64
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';

    // prepend a "header"
    const image64 = b64Start + svg64;

    // set it as the source of the img element
    img.src = image64;
    this.context.drawImage(img, 0, 0);
    //img.crossOrigin = 'Anonymous';
    //this.context.drawImage(this.svg, 0, 0);

    this.context.drawImage(blob, 0, 0);
    */
  }

  drawImage(data: string): void {
    const img = new Image();
    img.width = this.width;
    img.height = this.height;
    img.src = data;
    img.addEventListener('load', () => {
      if (this.context) {
        this.context.drawImage(img, 0, 0);
      }
    });
  }

  @HostListener('click', ['$event']) onMouseDown(event: MouseEvent): void {
    this.initialColour = this.getColourAtPosition(ClickHelper.getXPosition(event), ClickHelper.getYPosition(event));
    this.addSurroundingPixels(event.x, event.y);
  }

  protected addSurroundingPixels(positionX: number, positionY: number): void {
    const offset = 1;
    const up = this.getColourAtPosition(positionX, positionY + offset);
    const right = this.getColourAtPosition(positionX + offset, positionY);
    const down = this.getColourAtPosition(positionX, positionY - offset);
    const left = this.getColourAtPosition(positionX - offset, positionY);

    if (up === this.initialColour) {
      this.addSurroundingPixels(positionX, positionY + offset);
    } else {
      this.shape.points += positionX + ',' + positionY;
    }
    if (right === this.initialColour) {
      this.addSurroundingPixels(positionX + offset, positionY);
    } else {
      this.shape.points += positionX + ',' + positionY;
    }
    if (down === this.initialColour) {
      this.addSurroundingPixels(positionX, positionY - offset);
    } else {
      this.shape.points += positionX + ',' + positionY;
    }
    if (left === this.initialColour) {
      this.addSurroundingPixels(positionX - offset, positionY);
    } else {
      this.shape.points += positionX + ',' + positionY;
    }
  }

  getColourAtPosition(x: number, y: number): string {

    this.context = this.canvas.getContext('2d');
    const dataSVG = (new XMLSerializer())
    .serializeToString(this.exportInformation.data.canvasElement.nativeElement as Node);

    const img = new Image();
    img.width = this.width;
    img.height = this.height;
    const data = (new XMLSerializer()).serializeToString(this.exportInformation.data.canvasElement.nativeElement as Node);
    this.drawImage('data:image/svg+xml;base64,' + window.btoa(data));
    let imageData: any;
    if (this.context) {
    imageData = this.context.getImageData(x, y, 1, 1).data; }
    let arrayIndex = 0;
    return (imageData[arrayIndex].toString() + imageData[++arrayIndex].toString() +
            imageData[++arrayIndex].toString() + imageData[++arrayIndex].toString() );
  }
}
