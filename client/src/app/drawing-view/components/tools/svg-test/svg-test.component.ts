import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-test',
  templateUrl: './svg-test.component.html',
  styleUrls: ['./svg-test.component.scss']
})

export class SvgTestComponent implements OnInit {

  public _points : string;
  private _mouseDown : boolean = false;
  private _strokeWidth : number = 5;
  private _color : string = "black"
  public _mousePosition : string = "Mouse coordonates: ()";

  public lines :{
    points:string,
    color:string,
    strokeWidth:number 
    fill:string 
    strokeLinecap:string}[] = [];

  constructor() { }

  ngOnInit() {
  }

  onMouseDown(event : MouseEvent){
    this._mouseDown = true;
    this._points = event.offsetX + "," + event.offsetY;
    this._mousePosition = "Mouse coordonates: (" + event.offsetX + ", " + event.offsetY + ")";
  }

  onMouseMove(event : MouseEvent){
    if(this._mouseDown){
      this._points += (" " + event.offsetX + "," + event.offsetY);
    }
    this._mousePosition = "Mouse coordonates: (" + event.offsetX + ", " + event.offsetY + ")";
  }

  onMouseUp(){
    this._mouseDown = false;
    this.lines.push({
      points:this._points,
      color:this.getColor(),
      strokeWidth:this.getStrokeWidth(),
      fill:this.getFill(),
      strokeLinecap:this.getStrokeLinecap()});
    this._points = "";
  }

  onMouseLeave(){
    if(this._mouseDown)
      this.onMouseUp();
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

  strokeWidthIncrease(){
    if(this._strokeWidth <= 20)
      this._strokeWidth += 1;
  }

  strokeWidthDecrease(){
    if(this._strokeWidth > 1)
      this._strokeWidth -= 1;
  }

  setColorBlue(){
    this._color = "blue";
  }
  setColorGreen(){
    this._color = "green";
  }
  setColorRed(){
    this._color = "red";
  }
  setColorBlack(){
    this._color = "black";
  }
}
