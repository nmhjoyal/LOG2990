import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-tools-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent implements OnInit {
  private _cursorX:number;
  private _cursorY:number;
  private _height: number = 0;
  private _width: number = 0;
  private _strokeOpacity:number = 1;
  private _fillOpacity:number = 1;
  private _strokeWidth:number = 2;
  private _x:number = 0;
  private _y:number = 0;
  private _mouseDown: boolean = false;
  private shiftDown: boolean = false;

  //following array should be in a service for ease of access by the canvas
  public rectangles:{x:number, y:number, width:number, height:number, 
                    primeColor:string, secondColor:string, strokeWidth:number,
                    strokeOpacity:number, fillOpacity:number}[] = [];

  constructor() { }

  ngOnInit() {
  }

  // Event handling methods

  @HostListener('mousedown', ['$event']) onMouseDown(event:any){
    this._x=event.offsetX + this.getStrokeWidth()/2;
    this._y=event.offsetY + this.getStrokeWidth()/2;
    this._mouseDown = true;
  }

  @HostListener('mouseup') onMouseUp(){
    this._mouseDown = false;
    if(!(this._height == 0 && this._width == 0))
    this.rectangles.push(
      {x: this._x,
       y: this._y,
       width: this._width,
       height: this._height,
      primeColor: this.getPrimeColor(),
    secondColor: this.getSecondColor(),
    strokeOpacity: this.getStrokeOpacity(),
    strokeWidth: this.getStrokeWidth(),
    fillOpacity: this.getFillOpacity()
  }
       );
    this._height = 0;
    this._width = 0;
    this._x=0;
    this._y=0;
  }

  @HostListener('mouseleave') onMouseleave(){
    if(this._mouseDown)
    this.onMouseUp();
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event:any){
    this._cursorX = event.offsetX;
    this._cursorY = event.offsetY;
    
    if(this._mouseDown){
      this.calculateDimensions();
    }
  }

  @HostListener('keyup.shift', ['$event']) onShiftUp(event:any){
    this.shiftDown = false;
    if(this._mouseDown)
    this.calculateDimensions();
  }

  @HostListener('keydown.shift', ['$event']) onShiftDown(event:any){
    this.shiftDown = true;
    if(this._mouseDown)
    this.calculateDimensions();
  }


  //Funcitons

  calculateDimensions():void{
    this._width =  this._cursorX- this._x -  this.getStrokeWidth();
    this._height = this._cursorY - this._y -  this.getStrokeWidth();

    if(this.shiftDown){
      let minValue = Math.min(this._height, this._width);
      this._height = minValue;
      this._width = minValue;
    }
  }

  decreaseStrokeWidth():void{
    if(this._strokeWidth != 0)
    this._strokeWidth--;
  }

  increaseStrokeWidth():void{
    this._strokeWidth++;
  }

  setTraceMode(mode:number):void{//MAKE CONSTANTS FOR MODES
    switch (mode) {
      case 1://Contour
        this._strokeOpacity = 1;//load from service
        this._fillOpacity = 0;
        break;
      
      case 2://Fill
        this._strokeOpacity = 0;
        this._fillOpacity = 1;//load from service
        break;
    
      case 3://Contour&Fill
          this._strokeOpacity = 1;//load from service
          this._fillOpacity = 1;//load from service
          break;

      default:
        break;
    }

  }

  //Getter methods

  getX():number{
    return this._x;
  }

  getY():number{
    return this._y;
  }

  getRectangleWidth():number{
    return this._width;
  }

  getRectangleHeight():number{
    return this._height;
  }

  getStrokeWidth():number{
    return this._strokeWidth; 
  }

  getStrokeOpacity():number{
    return this._strokeOpacity;
  }

  getFillOpacity():number{
    return this._fillOpacity;
  }

  //These methods should be defined in the service 
  //that provides the information to rectangle for encapsulation purposes

  getPrimeColor():string{
    return "blue"; //Place holder, should load color from service here
  }

  getSecondColor():string{
    return "green"; //Place holder, should load color from service here
  }

}
