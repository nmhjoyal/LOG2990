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
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { ColorService } from '../../../../services/color_service/color.service';

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements AfterViewInit {

  @Input() private mainColor: boolean;
  @Input() private alpha: number[];
  @Input() lastColors: string[];

  @Output() primaryColor: EventEmitter<string> = new EventEmitter();
  @Output() secondaryColor: EventEmitter<string> = new EventEmitter();
  color = [this.primaryColor, this.secondaryColor];

  constructor(public colorService: ColorService) {}

  @ViewChild('canvas', {static: false})
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  private mousedown = false;

  selectedPosition: { x: number; y: number };

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

    const colorGradient = this.ctx.createLinearGradient(0, 0, 0, height);

    let separatorFactor = 0;
    // vertical color grandient
    colorGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * separatorFactor, 'rgba(255, 0, 0, 1)');
    colorGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(255, 102, 0, 1)');
    colorGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(255, 225, 55, 1)');
    colorGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 200, 25, 1)');
    colorGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 255, 255, 1)');
    colorGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 0, 255, 1)');
    colorGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(255, 0, 255, 1)');
    this.drawGradient(colorGradient, width, height);

    separatorFactor = 0;
    // horizontal greyscale gradient
    const greyscaleGradient = this.ctx.createLinearGradient( height, 0, 0, 0) ;
    greyscaleGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * separatorFactor, 'rgba(0, 0, 0, 1)');
    greyscaleGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 0, 0, 0.5)');
    greyscaleGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 0, 0, 0.25)');
    greyscaleGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 0, 0, 0)');
    greyscaleGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(0, 0, 0, 0)');
    greyscaleGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(255, 255, 255, 0.25)');
    greyscaleGradient.addColorStop(NumericalValues.COLOR_PALETTE_SEPARATOR * ++separatorFactor, 'rgba(255, 255, 255, 0.5)');
    greyscaleGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
    this.drawGradient(greyscaleGradient, width, height);
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(): void {
    this.mousedown = false;
    this.colorService.addColor();
  }

  onMouseDown(evt: MouseEvent): void {
    this.mousedown = true;
    this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
    this.draw();
    this.color[+this.mainColor].emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.mousedown) {
      this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
  }

  emitColor(x: number, y: number): void {
    const hexColor = this.getColorAtPosition(x, y);
    this.color[+this.mainColor].emit(hexColor);
  }

  getColorAtPosition(x: number, y: number): string {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data;
    let arrayIndex = 0;
    const r = this.colorService.rgbToHex(imageData[arrayIndex]);
    const g = this.colorService.rgbToHex(imageData[++arrayIndex]);
    const b = this.colorService.rgbToHex(imageData[++arrayIndex]);
    const a = this.colorService.rgbToHex(Math.round(this.alpha[+this.mainColor] * NumericalValues.RGBTOHEX_FACTOR));
    return ( '#' + r + g + b + a );
  }
}
