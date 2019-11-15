import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { ToolAbstract } from '../../assets/abstracts/tool-abstract/tool-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { Id, ToolConstants } from '../../assets/constants/tool-constants';
import { IShape } from '../../assets/interfaces/shape-interface';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss'],
})

export class BucketComponent extends ToolAbstract implements OnInit, OnDestroy {

  @Input() protected windowHeight: number;
  @Input() protected windowWidth: number;

  @ViewChild('canvas', { static: false })
  protected canvas: ElementRef<HTMLCanvasElement>;
  private shape: IShape;
  private tolerance: number;
  private context: CanvasRenderingContext2D;
  private initialColour: string;

  constructor( protected drawingStorage: SaveService, protected attributesService: AttributesService,
    protected colourService: ColourService) {
    super();
    this.tolerance = ToolConstants.DEFAULT_TOLERANCE;
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
  }
  ngOnInit(): void {
    if (this.attributesService.bucketAttributes.wasSaved) {
      this.shape.strokeWidth = this.attributesService.bucketAttributes.savedStrokeWidth;
      this.tolerance = this.attributesService.bucketAttributes.savedTolerance;
      this.traceMode = this.attributesService.polygonAttributes.savedTraceMode;
    }
    this.setTraceMode(this.traceMode);
  }

  ngOnDestroy(): void {
    this.attributesService.polygonAttributes.savedTraceMode = this.traceMode;
    this.saveAttribute();
  }

  @HostListener('keydown', ['$event']) onMouseDown(event: MouseEvent): void {
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
    this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    const imageData = this.context.getImageData(x, y, 1, 1).data;
    let arrayIndex = 0;
    return (imageData[arrayIndex].toString() + imageData[++arrayIndex].toString() +
            imageData[++arrayIndex].toString() + imageData[++arrayIndex].toString() );
  }

}
