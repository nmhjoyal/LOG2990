import { Component, OnInit } from '@angular/core';

const COLOR_BLACK = "black";
const DEFAULT_FILTER = "none";

@Component({
  selector: 'app-svg-test',
  templateUrl: './svg-test.component.html',
  styleUrls: ['./svg-test.component.scss']
})

export class SvgTestComponent implements OnInit {

  public _points : string;
  private _mouseDown : boolean = false;
  private _strokeWidth : number = 5;
  private _color : string = COLOR_BLACK
  private _filter : string = DEFAULT_FILTER
  public _mousePosition : string = "Mouse coordonates: ()";
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

  onMouseDown(event : MouseEvent){
    this._mouseDown = true;
    this._points = event.offsetX + "," + event.offsetY;
    this._x = event.offsetX;
    this._y = event.offsetY;
    this._mousePosition = "Mouse coordonates: (" + event.offsetX + ", " + event.offsetY + ")";
  }

  onMouseMove(event : MouseEvent){
    if(this._mouseDown){
      this._points += (" " + event.offsetX + "," + event.offsetY);
    }
    this._mousePosition = "Mouse coordonates: (" + event.offsetX + ", " + event.offsetY + ")";
  }

  onMouseUp(event : MouseEvent){
    
    if(this._x == event.offsetX && this._y == event.offsetY){
      this._points += (" " + (event.offsetX+0.1) + "," + (event.offsetY+0.1));
    }
    this._mouseDown = false;
    this.lines.push({
      points:this._points,
      color:this.getColor(),
      strokeWidth:this.getStrokeWidth(),
      fill:this.getFill(),
      strokeLinecap:this.getStrokeLinecap(),
      filter:this.getFilter()});
    this._points = "";
  }

  onMouseLeave(event : MouseEvent){
    if(this._mouseDown)
      this.onMouseUp(event);
  }
  
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
    return "none";
  }

  getStrokeLinecap(){
    return "round";
  }

  getFilter(){
    return this._filter;
  }

  strokeWidthIncrease(){
    if(this._strokeWidth <= 20)
      this._strokeWidth += 1;
  }

  strokeWidthDecrease(){
    if(this._strokeWidth > 1)
      this._strokeWidth -= 1;
  }

  setColor(index:number){
    switch(index){
      case 1:
      this._color = "blue";
      break;
      case 2:
        this._color = "green";
        break;
      case 3:
        this._color = "red";
        break;
      default:
      this._color = "black";
      break;
    }
  }
}
