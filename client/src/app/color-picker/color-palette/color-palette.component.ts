import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  EventEmitter,
  HostListener,
  HostBinding

} from '@angular/core'

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.css'],
})
export class ColorPaletteComponent implements AfterViewInit {

  @Input() mainColor: boolean
  @Input() colors: Array<string> 
  @Input() alpha: Array<number>;

  @Output() color1: EventEmitter<string> = new EventEmitter()
  @Output() color2: EventEmitter<string> = new EventEmitter()
  color = [this.color1, this.color2]
  //@Output() color2: EventEmitter<string> = new EventEmitter()
  //color  = [this.color1, this.color2]
 // @Output color =  new EventEmitter<{color1: string, color2: string}>()

  //@Output() color = [new EventEmitter(true), new EventEmitter(true)]
  //@Output() color[1] = new EventEmitter(true)

  //@Output() color: EventEmitter<Array<string>> = new EventEmitter()


  @ViewChild('canvas', {static: false})
  canvas: ElementRef<HTMLCanvasElement>

  private ctx: CanvasRenderingContext2D

  private mousedown: boolean = false

  public selectedPosition: { x: number; y: number }

  ngAfterViewInit() {
    this.draw()
  }

  draw() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d')
    }
    const width = this.canvas.nativeElement.width
    const height = this.canvas.nativeElement.height

    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);

    //vertical color grandient
    gradient.addColorStop(0,    'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.15, 'rgba(255, 102, 0, 1)');
    gradient.addColorStop(0.3,  'rgba(255, 225, 55, 1)');
    gradient.addColorStop(0.45, 'rgba(0, 200, 25, 1)');
    gradient.addColorStop(0.60, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.75, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.9, 'rgba(255, 0, 255, 1)');

    this.ctx.beginPath();
    this.ctx.rect(0, 0, width, height);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();

    //horizontal greyscale gradient
    const gradient2 = this.ctx.createLinearGradient( height, 0, 0, 0) ;
    gradient2.addColorStop(0, 'rgba(0, 0, 0, 1)'); 
    gradient2.addColorStop(0.15, 'rgba(0, 0, 0, 0.5)'); 
    gradient2.addColorStop(0.3, 'rgba(0, 0, 0, 0.25)'); 
    gradient2.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    gradient2.addColorStop(0.7, 'rgba(255, 255, 255, 0.25)'); 
    gradient2.addColorStop(0.85, 'rgba(255, 255, 255, 0.5)');
    gradient2.addColorStop(1, 'rgba(255, 255, 255, 1)');

    this.ctx.beginPath();
    this.ctx.rect(0, 0, width, height);
    this.ctx.fillStyle = gradient2;
    this.ctx.fill();
    this.ctx.closePath();
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false

    const pos = this.selectedPosition
    let duplicate = false;
    for  (let i = 0; i < this.colors.length; i++) {
      if (this.getColorAtPosition(pos.x, pos.y) == this.colors[i] ){
        duplicate = true;
      }
    }
    if (!duplicate){
      this.colors.shift()
      if (pos) {
      this.colors.push(this.getColorAtPosition(pos.x, pos.y))
      } 
    }
  }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true
    this.selectedPosition = { x: evt.offsetX, y: evt.offsetY }
    this.draw()/*
    if (this.mainColor){
      this.color.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY))
      }
    else{
      this.color2.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY))
    }*/
    this.color[+this.mainColor].emit(this.getColorAtPosition(evt.offsetX, evt.offsetY))
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedPosition = { x: evt.offsetX, y: evt.offsetY }
      this.draw()
      this.emitColor(evt.offsetX, evt.offsetY)
    }
  }

  emitColor(x: number, y: number) {
    const hexColor = this.getColorAtPosition(x, y)
    /*if (this.mainColor){
      this.color.emit(rgbaColor)
    }
    else{
      this.color2.emit(rgbaColor)
    }*/
    this.color[+this.mainColor].emit(hexColor)
  }

  rgb2hex(hue){
    if (!hue) return "00"
    else if (hue < 10) return ("0" + hue.toString(16))
    else return hue.toString(16)
  }
  
  getColorAtPosition(x: number, y: number) {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data
    return ( "#" + this.rgb2hex(imageData[0]) +  this.rgb2hex(imageData[1]) + this.rgb2hex(imageData[2]) + this.rgb2hex(Math.round(this.alpha[+this.mainColor]*255)))
  }

}



