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

  calculateDimensions(){
    this._width =  this._cursorX- this._x -  this.getStrokeWidth();
    this._height = this._cursorY - this._y -  this.getStrokeWidth();

    if(this.shiftDown){
      let minValue = Math.min(this._height, this._width);
      this._height = minValue;
      this._width = minValue;
    }
  }
  //Getter methods

  getCursorX():number{
    return this._cursorX;
  }

  getCursorY():number{
    return this._cursorY;
  }

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

  //These methods should be defined in the service 
  //that provides the information to rectangle for encapsulation purposes

  getPrimeColor():string{
    return "blue"; //Place holder, should load color from service here
  }

  getSecondColor():string{
    return "green"; //Place holder, should load color from service here
  }

  getStrokeWidth():number{
    return 3; //should load strokewidth from the service
  }

  getStrokeOpacity():number{
    return 1; //should load strokewidth from the service
  }

  getFillOpacity():number{
    return 1; //should load strokewidth from the service
  }

  decreaseStrokeWidth(){//calls the method of the service to decrease stroke width
  }

  increaseStrokeWidth(){//calls the method of the service to increase stroke width
  }

  //Service exclusive methods
  
  setTraceMode(mode:number){//à mettre dans le service
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

}
