import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import RotateHelper from 'src/app/helpers/rotate-helper/rotate-helper';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';
import { IComplexPath, IPen } from '../../assets/interfaces/drawing-tool-interface';

@Component({
  selector: 'app-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss'],
})

export class QuillComponent extends StrokeAbstract implements OnInit, OnDestroy {

  private quill: IPen;
  private lineLength: number;
  private angle: number;
  private lastX: number;
  private lastY: number;
  private angleIncrement: number;

  constructor(saveServiceRef: SaveService,
              attributesServiceRef: AttributesService,
              colourServiceRef: ColourService) {
    super(saveServiceRef, attributesServiceRef, colourServiceRef);
    this.quill = {
      id: ToolConstants.TOOL_ID.QUILL,
      paths: [],
      colour: this.colourService.PrimaryColour,
      strokeLinecap: ToolConstants.ROUND,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      points: '',
      scaleX: ToolConstants.DEFAULT_SCALE,
      scaleY: ToolConstants.DEFAULT_SCALE,
    };
    this.lineLength = ToolConstants.DEFAULT_LINE_LENGTH;
    this.angle = ToolConstants.DEFAULT_ANGLE;
    this.lastX = 0;
    this.lastY = 0;
    this.angleIncrement = ToolConstants.ANGLE_INCREMENT_15;
  }

  ngOnInit(): void {
    if (this.attributesService.quillAttributes.wasSaved) {
      this.lineLength = this.attributesService.quillAttributes.savedLineLength;
      this.angle = this.attributesService.quillAttributes.savedAngle;
    }
    this.colourService.data.subscribe((colour: string[]) => {
      this.quill.colour = colour[0];
    });
  }

  ngOnDestroy(): void {
    this.saveAttribute();
  }

  saveAttribute(): void {
    this.attributesService.quillAttributes.wasSaved = true;
    this.attributesService.quillAttributes.savedLineLength = this.lineLength;
    this.attributesService.quillAttributes.savedAngle = this.angle;
  }

  @HostListener('keydown.alt') onKeyDownAlt(): void {
    this.angleIncrement = (this.angleIncrement === ToolConstants.ANGLE_INCREMENT_15) ?
      this.angleIncrement = ToolConstants.ANGLE_INCREMENT_1 :
      this.angleIncrement = ToolConstants.ANGLE_INCREMENT_15;
  }

  @HostListener('wheel', ['$event']) onWheel(event: WheelEvent): void {
    if (event.deltaY > 0) {
      this.increaseAngle(this.angleIncrement);
    } else {
      this.decreaseAngle(this.angleIncrement);
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.lastX = ClickHelper.getXPosition(event);
    this.lastY = ClickHelper.getYPosition(event);
    this.quill.x = this.lastX;
    this.quill.y = this.lastY;
    this.quill.width = 0;
    this.quill.height = 0;
    this.quill.points = this.lastX + ',' + this.lastY;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      const x = ClickHelper.getXPosition(event);
      const y = ClickHelper.getYPosition(event);

      this.calculatePath(x, y);
      this.lastX = x;
      this.lastY = y;
    }
  }

  onMouseUp(): void {
    this.saveShape();
    this.mouseDown = false;
    this.quill.paths = [];
    this.quill.points = '';
  }

  protected updatePositionAndDimensions(x: number, y: number): void {
    this.quill.x = x < this.quill.x ? x : this.quill.x;
    this.quill.y = y < this.quill.y ? y : this.quill.y;
    this.quill.width = x > this.quill.width ? x : this.quill.width;
    this.quill.height = y > this.quill.height ? y : this.quill.height;
  }

  protected calculatePath(x: number, y: number): void {
    const offsetX = x - this.lastX;
    const offsetY = y - this.lastY;
    const distance = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
    if (distance > ToolConstants.DEFAULT_STROKE_WIDTH) {
      this.fillGaps(offsetX, offsetY, distance);
    }
    this.addPath(x, y);
  }

  protected addPath(x: number, y: number): void {
    const angleRad = RotateHelper.degreeToRad(this.angle);
    const x1 = x - (this.lineLength / 2) * Math.cos(angleRad);
    const x2 = x + (this.lineLength / 2) * Math.cos(angleRad);
    const y1 = y - (this.lineLength / 2) * Math.sin(angleRad);
    const y2 = y + (this.lineLength / 2) * Math.sin(angleRad);
    const path: IComplexPath = {
      path: 'M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2,
      pathWidth: ToolConstants.DEFAULT_STROKE_WIDTH,
    };
    this.quill.points += ' ' + x + ',' + y;
    if (this.quill.paths) {
      this.quill.paths.push(path);
    }
    this.updatePositionAndDimensions(x, y);
  }

  protected fillGaps(offsetX: number, offsetY: number, distance: number): void {
    let x = this.lastX;
    let y = this.lastY;
    const xIncrement = 2 * offsetX / distance;
    const yIncrement = 2 * offsetY / distance;
    for (let i = 0; i < Math.abs(distance) / 2; i++) {
      x += xIncrement;
      y += yIncrement;
      this.addPath(x, y);
    }
  }

  protected saveShape(): void {
    const currentDrawing: IPen = {
      id: this.quill.id,
      paths: this.quill.paths,
      colour: this.quill.colour,
      strokeLinecap: this.quill.strokeLinecap,
      x: this.quill.x,
      y: this.quill.y,
      width: this.quill.width - this.quill.x,
      height: this.quill.height - this.quill.y,
      points: this.quill.points,
      scaleX: this.quill.scaleX,
      scaleY: this.quill.scaleY,
    };
    this.drawingStorage.saveDrawing(currentDrawing);
  }

  increaseLineLength(): void {
    this.lineLength++;
  }

  decreaseLineLength(): void {
    if (this.lineLength > 1) {
      this.lineLength--;
    }
  }

  increaseAngle(increment: number): void {
    this.angle += increment;
  }

  decreaseAngle(decrement: number): void {
    this.angle -= decrement;
  }
}
