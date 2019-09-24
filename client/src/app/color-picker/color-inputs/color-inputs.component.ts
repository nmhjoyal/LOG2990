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
  HostListener, } from '@angular/core';

@Component({
  selector: 'app-color-inputs',
  templateUrl: './color-inputs.component.html',
  styleUrls: ['./color-inputs.component.css']
})
///export class ColorInputsComponent implements OnInit {

export class ColorInputsComponent implements AfterViewInit, OnChanges {
  @Input()
  hue: string


  @Output()
  color: EventEmitter<string> = new EventEmitter(true)
  colors: Array<string> = new Array;

  @ViewChild('box', {static: false})
  canvas: ElementRef<HTMLCanvasElement>

  private ctx: CanvasRenderingContext2D

  private mousedown: boolean = false

  public selectedPosition: { x: number; y: number }

  ngAfterViewInit() {

  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes['hue']) {
      const pos = this.selectedPosition
      if (pos) {
        this.color.emit(this.getColorAtPosition(pos.x, pos.y))
      }
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false
    if (this.colors.length == 10){
        this.colors.pop()
      }
    const pos = this.selectedPosition
    if (pos) {
      this.colors.push(this.getColorAtPosition(pos.x, pos.y))
    }
      
    
  }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true
    this.selectedPosition = { x: evt.offsetX, y: evt.offsetY }
    this.color.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY))
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedPosition = { x: evt.offsetX, y: evt.offsetY }
      this.emitColor(evt.offsetX, evt.offsetY)
    }
  }



  emitColor(x: number, y: number) {
    const rgbaColor = this.getColorAtPosition(x, y)
    this.color.emit(rgbaColor)
  }

  getColorAtPosition(x: number, y: number) {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data
    return (
      'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)'
    )
  }

  setColor(input: string ){
    if (input | "ffffff"){
      this.color.emit(input)
    }
  }
  



}
