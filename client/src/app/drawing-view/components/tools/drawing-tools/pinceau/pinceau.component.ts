import { Component, OnInit} from '@angular/core';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { DrawingToolsAbstract } from '../drawing-tools-abstract';

const STROKE_LINECAP_MODE = 'round';
const FILL_MODE = 'none';
const PINCEAU_FILTER = 'url(#displacementFilter)';

@Component({
  selector: 'app-pinceau',
  templateUrl: './pinceau.component.html',
  styleUrls: ['./pinceau.component.scss'],
})
export class PinceauComponent extends DrawingToolsAbstract implements OnInit {

  ngOnInit() {
    // empty block
  }

  constructor(myDrawingToolService: LocalStorageService) {
    super(myDrawingToolService);
  }

  // Abstract&Overridden methods

  protected saveShape(): void {
    this.drawingToolService.lines.push({
      points: this.points,
      color: this.getPrimeColor(),
      strokeWidth: this.getStrokeWidth(),
      fill: FILL_MODE,
      strokeLinecap: STROKE_LINECAP_MODE,
      filter: PINCEAU_FILTER});
  }
}
