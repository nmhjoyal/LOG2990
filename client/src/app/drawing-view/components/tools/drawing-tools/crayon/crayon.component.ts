import { Component} from '@angular/core';
import { DrawingToolsAbstract } from '../drawing-tools-abstract';

const STROKE_LINECAP_MODE = "round";
const FILL_MODE = "none";
const DEFAULT_FILTER = "none";

@Component({
  selector: 'app-crayon',
  templateUrl: './crayon.component.html',
  styleUrls: ['./crayon.component.scss']
})
export class CrayonComponent extends DrawingToolsAbstract {

  ngOnInit() {
  }

  // Abstract&Overridden methods
  
  protected saveShape(): void {
    this.lines.push({
      points:this._points,
      color:this.getColor(),
      strokeWidth:this.getStrokeWidth(),
      fill:FILL_MODE,
      strokeLinecap:STROKE_LINECAP_MODE,
      filter:DEFAULT_FILTER});
  }

}
