import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-test',
  templateUrl: './svg-test.component.html',
  styleUrls: ['./svg-test.component.scss']
})

export class SvgTestComponent implements OnInit {

  public _points : string;
  private _mouseDown : boolean = false;
  public _lines : string[];
  public _mousePosition : string = "";
  
  constructor() { }

  ngOnInit() {
  }

  onMouseDown(event : MouseEvent){
    this._points = event.offsetX + "," + event.offsetY;
    this._mouseDown = true;
    this._mousePosition = "Mouse coordonates: (" + event.offsetX + ", " + event.offsetY + ")";
  }

  onMouseMove(event : MouseEvent){
    if(this._mouseDown){
      this._points += (" " + event.offsetX + "," + event.offsetY);
    }
    //this._mousePosition = "Mouse coordonates: (" + event.offsetX + ", " + event.offsetY + ")";
  }

  onMouseUp(event : MouseEvent){
    this._lines.push(this._points);
    this._mouseDown = false;
    this._mousePosition = "Mouse coordonates: (" + event.offsetX + ", " + event.offsetY + ")";
  }
  
  getPoints(){
    return this._points;
  }
}
