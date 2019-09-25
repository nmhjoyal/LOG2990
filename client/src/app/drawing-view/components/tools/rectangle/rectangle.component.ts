import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-tools-rectangle',
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
  private _shiftDown: boolean = false;

  //following array should be in a service for ease of access by the canvas
  public rectangles:{x:number, y:number, width:number, height:number, 
                    primeColor:string, secondColor:string, strokeWidth:number,
                    strokeOpacity:number, fillOpacity:number}[] = [];

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
       height: this._rectH,
       primeColor: this.getPrimeColor(),
       secondColor: this.getSecondColor(),
       strokeWidth: this.getStrokeWidth(),
       strokeOpacity: this.getStrokeOpacity(),
       fillOpacity: this.getFillopacity()}
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
      
      if(this._shiftDown)
      this._rectH = this._rectW
      }
      
      this._cursorX = event.offsetX;
      this._cursorY = event.offsetY;
  }

  @HostListener('keyup.shift', ['$event'])onShiftUp(event:any){
    this._shiftDown = false;
    //maxValue: Math.max(this._rectH, this._rectW); necessaire??
    this._rectW = this._cursorX - this._x;
    this._rectH = this._cursorY - this._y;

    //debugger;
  }

  @HostListener('keydown.shift', ['$event']) on_shiftDown(event:any){
    this._shiftDown = true;
    this._rectH = this._rectW;
    
    //debugger;
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

  getRectW():number{
    return this._rectW;
  }

  getRectH():number{
    return this._rectH;
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

  getFillopacity():number{
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
