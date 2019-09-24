import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent implements OnInit {
  private _cursorX:number;//passable with service
  private _cursorY:number;
  private _rectH: number = 0;
  private _rectW: number = 0;
  private _x:number = 0;
  private _y:number = 0;
  private _mouseDown: boolean = false;
  private shiftDown: boolean = false;

  public rectangles:{x:number, y:number, 
                      width:number, height:number}[] = [];

  constructor() { }

  ngOnInit() {
  }

  // Event handling methods
  @HostListener('mousedown', ['$event']) onMouseDown(event:any){
    this._x=event.offsetX;
    this._y=event.offsetY;
    this._mouseDown = true;
  }
  @HostListener('mouseup') onMouseUp(){
    this._mouseDown = false;
    if(!(this._rectH == 0 && this._rectW == 0))
    this.rectangles.push(
      {x: this._x,
       y: this._y,
       width: this._rectW,
       height: this._rectH}
       );
    this._rectH = 0;
    this._rectW = 0;
    this._x=0;
    this._y=0;
  }

  @HostListener('mouseleave') onMouseleave(){
    this.onMouseUp();
  }

  @HostListener('mousemove', ['$event'])onMouseMove(event:any){
    if(this._mouseDown){
      this._rectW = event.offsetX - this._x;
      this._rectH = event.offsetY - this._y;
      
      if(this.shiftDown)
      this._rectH = this._rectW
      }
      
      this._cursorX = event.offsetX;
      this._cursorY = event.offsetY;
  }

  @HostListener('keyup.shift', ['$event'])onShiftUp(event:any){
    this.shiftDown = false;
    //maxValue: Math.max(this._rectH, this._rectW); necessaire??
    this._rectW = this._cursorX - this._x;
    this._rectH = this._cursorY - this._y;

    //debugger;
  }

  @HostListener('keydown.shift', ['$event']) onShiftDown(event:any){
    this.shiftDown = true;
    this._rectH = this._rectW;
    
    //debugger;
  }


  //Getter methods

  getCursorX(){
    return this._cursorX;
  }

  getCursorY(){
    return this._cursorY;
  }

  getX(){
    return this._x;
  }

  getY(){
    return this._y;
  }

  getRectW(){
    return this._rectW;
  }

  getRectH(){
    return this._rectH;
  }

}
