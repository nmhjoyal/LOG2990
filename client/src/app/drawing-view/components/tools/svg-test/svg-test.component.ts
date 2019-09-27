import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-test',
  templateUrl: './svg-test.component.html',
  styleUrls: ['./svg-test.component.scss']
})

export class SvgTestComponent implements OnInit {

  public _points : string;
  private _mouseDown : boolean = false;
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
    return "black";
  }
  getStrokeWidth(){
    return 15;
  }
  getFill(){
    return "none";
  }
  getStrokeLinecap(){
    return "round";
  }
}
