import { HostListener, OnInit } from '@angular/core';

const STROKE_LINECAP_MODE = "round";
const FILL_MODE = "none";
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_FILTER = "none";

export abstract class DrawingToolsAbstract implements OnInit {
  public _points : string;
  private _mouseDown : boolean = false;
  private _strokeWidth : number = DEFAULT_STROKE_WIDTH;
  private _color : string = "black";
  private _filter : string = DEFAULT_FILTER;
  private _x:number;
  private _y:number;

  public lines :{
    points:string,
    color:string,
    strokeWidth:number 
    fill:string 
    strokeLinecap:string
    filter:string}[] = [];

  constructor() { }

  ngOnInit() {
  }

  // Abstract methods

  protected abstract saveShape(): void;

  // Event handling methods

  @HostListener('mousedown', ['$event']) onMouseDown(event: any){
    this._mouseDown = true;
    this._points = event.offsetX + "," + event.offsetY;
    this._x = event.offsetX;
    this._y = event.offsetY;
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: any){
    if(this._mouseDown){
      this._points += (" " + event.offsetX + "," + event.offsetY);
    }
    this.saveShape();
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: any){
    
    if(this._x == event.offsetX && this._y == event.offsetY){
      this._points += (" " + (event.offsetX+0.1) + "," + (event.offsetY+0.1));
    }
    this._mouseDown = false;
    
    this._points = "";
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: any){
    if(this._mouseDown)
      this.onMouseUp(event);
  }
  
  // Functions

  increaseStrokeWidth(){
    this._strokeWidth++;
  }

  decreaseStrokeWidth(){
    if(this._strokeWidth > 1)
      this._strokeWidth--;
  }

  // Getter methods

  getPoints(){
    return this._points;
  }

  getColor(){
    return this._color;
  }

  getStrokeWidth(){
    return this._strokeWidth;
  }

  getFill(){
    return FILL_MODE;
  }

  getStrokeLinecap(){
    return STROKE_LINECAP_MODE;
  }

  getFilter(){
      return this._filter;
  }
  

  setColor(color:string){
    this._color = color;
  }
  
}


