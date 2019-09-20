import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent implements OnInit {
  private _cursorX:number;
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
  onMouseDown($event){
    this._x=$event.offsetX;
    this._y=$event.offsetY;
    this._mouseDown = true;
    this.testMessage = "Loaded mouse coordinates: (" + this._x +", " +this._y + ")";
  }

  onMouseUp(){
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

  onMouseMove($event){
    if(this._mouseDown){
      this._rectW = $event.offsetX - this._x;
      this._rectH = $event.offsetY - this._y;
      
      if(this.shiftDown)
      this._rectH = this._rectW
      }
      
      this._cursorX = $event.offsetX;
      this._cursorY = $event.offsetY;
  }

  onShiftUp($event){
    this.shiftDown = false;
    //maxValue: Math.max(this._rectH, this._rectW); necessaire??
    this._rectW = this._cursorX - this._x;
    this._rectH = this._cursorY - this._y;

    //debugger;
  }

  onShiftDown($event){
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
