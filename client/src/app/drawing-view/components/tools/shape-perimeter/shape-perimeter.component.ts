import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-shape-perimeter',
  templateUrl: './shape-perimeter.component.html',
  styleUrls: ['./shape-perimeter.component.scss']
})
export class ShapePerimeterComponent implements OnInit {
  private _height: number = 0;
  private _width: number = 0;
  private _x:number = 0;
  private _y:number = 0;
  private _mouseDown: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event:any){
    this._x=event.offsetX;
    this._y=event.offsetY;
    this._mouseDown = true;
  }

  @HostListener('mouseup') onMouseUp(){
    this._mouseDown = false;
    this._height = 0;
    this._width = 0;
    this._x=0;
    this._y=0;
  }

  @HostListener('mouseleave') onMouseleave(){
    this.onMouseUp();
  }

  @HostListener('mousemove', ['$event'])onMouseMove(event:any){
    if(this._mouseDown){
      this._width = event.offsetX - this._x;
      this._height = event.offsetY - this._y;}
  }

  getX(){
    return this._x;
  }

  getY(){
    return this._y;
  }

  getRectangleWidth(){
    return this._width;
  }

  getRectangleHeight(){
    return this._height;
  }

}
