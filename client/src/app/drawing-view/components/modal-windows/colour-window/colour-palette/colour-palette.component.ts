import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { ColourConstants, Rainbow, Transparency  } from '../../../tools/assets/constants/colour-constants';

@Component({
  selector: 'app-colour-palette',
  templateUrl: './colour-palette.component.html',
  styleUrls: ['./colour-palette.component.scss'],
})
export class ColourPaletteComponent implements AfterViewInit {

  @ViewChild('canvas', { static: false })
  protected canvas: ElementRef<HTMLCanvasElement>;

  @Input() private mainColour: boolean;
  @Input() private alpha: number[];
  @Input() protected lastColours: string[];

  @Output() protected primaryColour: EventEmitter<string> = new EventEmitter();
  @Output() protected secondaryColour: EventEmitter<string> = new EventEmitter();

  colour: EventEmitter<string>[];
  private context: CanvasRenderingContext2D;
  private mouseDown: boolean;
  protected selectedPosition: { x: number; y: number };

  constructor(public colourService: ColourService) {
    this.colour = [this.primaryColour, this.secondaryColour];
    this.mouseDown = false;
  }

  ngAfterViewInit(): void {
    this.draw();
  }

  drawGradient(gradient: CanvasGradient, width: number, height: number): void {
    this.context.beginPath();
    this.context.rect(0, 0, width, height);
    this.context.fillStyle = gradient;
    this.context.fill();
    this.context.closePath();
  }

  draw(): void {
    this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;
    const colourGradient = this.context.createLinearGradient(0, 0, 0, height);

    let separatorFactor = 0;
    // vertical colour grandient
    colourGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * separatorFactor, Rainbow.RED);
    colourGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Rainbow.ORANGE);
    colourGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Rainbow.YELLOW);
    colourGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Rainbow.GREEN);
    colourGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Rainbow.TEAL);
    colourGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Rainbow.BLUE);
    colourGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Rainbow.VIOLET);
    this.drawGradient(colourGradient, width, height);

    separatorFactor = 0;
    // horizontal greyscale gradient
    const greyscaleGradient = this.context.createLinearGradient( height, 0, 0, 0) ;
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * separatorFactor, Transparency .FULL);
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Transparency .HALF);
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Transparency .QUARTER);
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Transparency .NONE);
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Transparency .NONE);
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Transparency .QUARTER_BLACK);
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Transparency .HALF_BLACK);
    greyscaleGradient.addColorStop(1, Transparency .FULL_BLACK);
    this.drawGradient(greyscaleGradient, width, height);
  }

  @HostListener('mouseup', ['$event']) onMouseUp(): void {
    this.mouseDown = false;
    this.colourService.addColour();
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.selectedPosition = { x: ClickHelper.getXPosition(event), y: ClickHelper.getYPosition(event) };
    this.draw();
    this.colour[+this.mainColour].emit(this.getColourAtPosition(ClickHelper.getXPosition(event), ClickHelper.getYPosition(event)));
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      this.selectedPosition = { x: ClickHelper.getXPosition(event), y: ClickHelper.getYPosition(event) };
      this.draw();
      this.emitColour(ClickHelper.getXPosition(event), ClickHelper.getYPosition(event));
    }
  }

  emitColour(x: number, y: number): void {
    const hexColour = this.getColourAtPosition(x, y);
    this.colour[+this.mainColour].emit(hexColour);
  }

  getColourAtPosition(x: number, y: number): string {
    const imageData = this.context.getImageData(x, y, 1, 1).data;
    let arrayIndex = 0;
    const r = this.colourService.rgbToHex(imageData[arrayIndex]);
    const g = this.colourService.rgbToHex(imageData[++arrayIndex]);
    const b = this.colourService.rgbToHex(imageData[++arrayIndex]);
    const a = this.colourService.rgbToHex(Math.round(this.alpha[+this.mainColour] * ColourConstants.RGB_TO_HEX_FACTOR));
    return ('#' + r + g + b + a);
  }
}
