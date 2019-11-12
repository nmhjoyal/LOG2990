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
import { NumericalValues } from 'src/AppConstants/NumericalValues';

@Component({
  selector: 'app-colour-palette',
  templateUrl: './colour-palette.component.html',
  styleUrls: ['./colour-palette.component.scss'],
})
export class ColourPaletteComponent implements AfterViewInit {

  @Input() private mainColour: boolean;
  @Input() private alpha: number[];
  @Input() protected lastColours: string[];

  @Output() protected primaryColour: EventEmitter<string> = new EventEmitter();
  @Output() protected secondaryColour: EventEmitter<string> = new EventEmitter();
  private colour = [this.primaryColour, this.secondaryColour];

  constructor(public colourService: ColourService) { }

  @ViewChild('canvas', { static: false })
  protected canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  private mousedown = false;

  protected selectedPosition: { x: number; y: number };

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
    colourGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * separatorFactor, 'rgba(255, 0, 0, 1)');
    colourGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(255, 102, 0, 1)');
    colourGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(255, 225, 55, 1)');
    colourGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 200, 25, 1)');
    colourGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 255, 255, 1)');
    colourGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 0, 255, 1)');
    colourGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(255, 0, 255, 1)');
    this.drawGradient(colourGradient, width, height);

    separatorFactor = 0;
    // horizontal greyscale gradient
    const greyscaleGradient = this.ctx.createLinearGradient(height, 0, 0, 0);
    greyscaleGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * separatorFactor, 'rgba(0, 0, 0, 1)');
    greyscaleGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 0, 0, 0.5)');
    greyscaleGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 0, 0, 0.25)');
    greyscaleGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 0, 0, 0)');
    greyscaleGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 0, 0, 0)');
    greyscaleGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(255, 255, 255, 0.25)');
    greyscaleGradient.addColorStop(NumericalValues.COLOUR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(255, 255, 255, 0.5)');
    greyscaleGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
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
    const a = this.colourService.rgbToHex(Math.round(this.alpha[+this.mainColour] * NumericalValues.RGBTOHEX_FACTOR));
    return ('#' + r + g + b + a);
  }
}
