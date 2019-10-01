import { Component, OnInit} from '@angular/core';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { DrawingToolsAbstract } from '../drawing-tools-abstract';

const STROKE_LINECAP_MODE = "round";
const FILL_MODE = "none";


@Component({
  selector: 'app-pinceau',
  templateUrl: './pinceau.component.html',
  styleUrls: ['./pinceau.component.scss'],
})
export class PinceauComponent extends DrawingToolsAbstract implements OnInit {

  public currentFilter:{baseFrequency:string,
                        numOctaves:string,
                        scale:string};

  ngOnInit() {
    //empty block
  }

  constructor(myDrawingToolService: LocalStorageService) {
    super(myDrawingToolService);
    this.currentFilter = myDrawingToolService.filters[0];
  }

  public setFilter(n:number): void {
    this.currentFilter = this.drawingToolService.filters[n];
  }


  // Abstract&Overridden methods

  protected saveShape(): void {

    this.drawingToolService.paints.push({
      points:this._points,
      color:this.getColor(),
      strokeWidth:this.getStrokeWidth(),
      fill:FILL_MODE,
      strokeLinecap:STROKE_LINECAP_MODE,
      filter: this.currentFilter});

  }
}
