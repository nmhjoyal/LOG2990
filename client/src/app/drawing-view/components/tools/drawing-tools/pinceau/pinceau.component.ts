import { Component, OnInit} from '@angular/core';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { DrawingToolsAbstract } from '../drawing-tools-abstract';

@Component({
  selector: 'app-pinceau',
  templateUrl: './pinceau.component.html',
  styleUrls: ['./pinceau.component.scss'],
})
export class PinceauComponent extends DrawingToolsAbstract implements OnInit {

  currentFilter: {baseFrequency: string,
                        numOctaves: string,
                        scale: string};

  ngOnInit() {
    // empty block
  }

  constructor(myDrawingToolService: LocalStorageService) {
    super(myDrawingToolService);
    this.currentFilter = myDrawingToolService.filters[0];
  }

  setFilter(n: number): void {
    this.currentFilter = this.drawingToolService.filters[n];
  }

  // Abstract&Overridden methods

}
