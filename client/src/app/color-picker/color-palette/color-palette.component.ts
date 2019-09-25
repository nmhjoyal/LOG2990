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
} from '@angular/core'

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.css'],
})
export class ColorPaletteComponent implements AfterViewInit, OnChanges {

  @Input() alpha: number
  @Input() mainColor: boolean = false
  @Input() public colors: Array<string> 
  
  @Output() color2: EventEmitter<string> = new EventEmitter(true)
  @Output() color: EventEmitter<string> = new EventEmitter(true)
  @Output() emitAlpha: EventEmitter<number> = new EventEmitter(true)
  

  @ViewChild('canvas', {static: false})
  canvas: ElementRef<HTMLCanvasElement>

  
  //public mainColor: boolean = false;
  //public alpha: number = 1;

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
    //gradient.addColorStop(0,   'rgba(0, 0, 0, 1)'); 
    gradient.addColorStop(0,    'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.15, 'rgba(255, 102, 0, 1)');
    gradient.addColorStop(0.3,  'rgba(255, 225, 55, 1)');
    gradient.addColorStop(0.45, 'rgba(0, 200, 25, 1)');
    gradient.addColorStop(0.60, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.75, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.9, 'rgba(255, 0, 255, 1)');
    //gradient.addColorStop(1,   'rgba(255, 255, 255, 1)');

    this.ctx.beginPath();
    this.ctx.rect(0, 0, width, height);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();

   
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
    this.draw()
    if (this.mainColor){
      this.color.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY))
      }
    else{
      this.color2.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY))
    }
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedPosition = { x: evt.offsetX, y: evt.offsetY }
      this.draw()
      this.emitColor(evt.offsetX, evt.offsetY)
    }
  }



  emitColor(x: number, y: number) {
    const rgbaColor = this.getColorAtPosition(x, y)
    if (this.mainColor){
      this.color.emit(rgbaColor)
    }
    else{
      this.color2.emit(rgbaColor)
    }
  }

  getColorAtPosition(x: number, y: number) {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data
    return (
      'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',' + this.alpha+')'
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['alpha']) {
      this.alpha = changes.item.currentValue
    }
  }


  setColor(input: string ){
    if(this.mainColor){
      this.color.emit(input)
      }
    else{
      this.color2.emit(input)
    }
  }
  

  setAlpha(alpha: number){
    this.alpha = alpha;
    this.emitAlpha.emit(alpha);
  }

  switchColors(){
  let inter = this.color
  this.color = this.color2
  this.color2 = inter
}
}



