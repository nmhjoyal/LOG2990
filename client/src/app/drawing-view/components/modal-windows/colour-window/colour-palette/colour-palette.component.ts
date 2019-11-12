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
import { ColourConstants, Rainbow, Transparancy } from '../../../tools/assets/constants/colour-constants';

@Component({
  selector: 'app-colour-palette',
  templateUrl: './colour-palette.component.html',
  styleUrls: ['./colour-palette.component.scss'],
})
export class ColourPaletteComponent implements AfterViewInit {

  @Input() private mainColour: boolean;
  @Input() private alpha: number[];
  @Input() lastColours: string[];

  @Output() primaryColour: EventEmitter<string> = new EventEmitter();
  @Output() secondaryColour: EventEmitter<string> = new EventEmitter();

  colour: EventEmitter<string>[];
  private ctx: CanvasRenderingContext2D;
  private mousedown: boolean;
  protected selectedPosition: { x: number; y: number };

  constructor(public colourService: ColourService) {
    this.colour = [this.primaryColour, this.secondaryColour];
    this.mousedown = false;
  }

  @ViewChild('canvas', {static: false})
  canvas: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.draw();
  }

  drawGradient(gradient: CanvasGradient, width: number, height: number): void {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, width, height);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();
  }

  draw(): void {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    const colourGradient = this.ctx.createLinearGradient(0, 0, 0, height);

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
    const greyscaleGradient = this.ctx.createLinearGradient( height, 0, 0, 0) ;
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * separatorFactor, Transparancy.FULL);
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Transparancy.HALF);
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Transparancy.QUARTER);
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Transparancy.NONE);
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Transparancy.NONE);
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Transparancy.QUARTER_BLACK);
    greyscaleGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, Transparancy.HALF_BLACK);
    greyscaleGradient.addColorStop(1, Transparancy.FULL_BLACK);
    this.drawGradient(greyscaleGradient, width, height);
  }

  @HostListener('window:mouseup', ['$event'])

  onMouseUp(): void {
    this.mousedown = false;
    this.colourService.addColour();
  }

  onMouseDown(event: MouseEvent): void {
    this.mousedown = true;
    this.selectedPosition = { x: ClickHelper.getXPosition(event), y: ClickHelper.getYPosition(event) };
    this.draw();
    this.colour[+this.mainColour].emit(this.getColourAtPosition(ClickHelper.getXPosition(event), ClickHelper.getYPosition(event)));
  }

  onMouseMove(event: MouseEvent): void {
    if (this.mousedown) {
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
    const imageData = this.ctx.getImageData(x, y, 1, 1).data;
    let arrayIndex = 0;
    const r = this.colourService.rgbToHex(imageData[arrayIndex]);
    const g = this.colourService.rgbToHex(imageData[++arrayIndex]);
    const b = this.colourService.rgbToHex(imageData[++arrayIndex]);
    const a = this.colourService.rgbToHex(Math.round(this.alpha[+this.mainColour] * ColourConstants.RGBTOHEX_FACTOR));
    return ( '#' + r + g + b + a );
  }
}
