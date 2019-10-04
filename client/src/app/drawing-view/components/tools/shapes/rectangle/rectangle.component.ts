import { Component, OnInit } from '@angular/core';
import { ShapeAbstract } from '../assets/shape-abstract';
import { ToolHandlerService } from 'src/app/services/tool-handler.service';

@Component({
  selector: 'app-tools-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent extends ShapeAbstract implements OnInit {

  constructor(serviceRef: ToolHandlerService) {
    super(serviceRef);
  }

  ngOnInit() {
    // empty init
  }

  // Abstract&Overridden methods

  protected calculateDimensions(): void {
    super.calculateDimensions();
    if (this.shiftDown ) { // Carré maximale Non centré...
      const minValue = Math.min(this.shape.height, this.shape.width);
      this.shape.height = minValue;
      this.shape.width = minValue;
    }
  }

}
