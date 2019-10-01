import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { ShapeAbstract } from '../assets/shape-abstract';

@Component({
  selector: 'app-tools-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent extends ShapeAbstract implements OnInit {

  constructor(myShapeService: LocalStorageService) {
    super(myShapeService);
  }

  ngOnInit() {
    // empty init
  }

  // Abstract&Overridden methods

  protected saveShape(): void {
    this.shapeService.rectangles.push(
      {x: this.shapeX,
      y: this.shapeY,
      width: this.shapeWidth,
      height: this.shapeHeight,
      primeColor: this.getPrimeColor(),
      secondColor: this.getSecondColor(),
      strokeOpacity: this.strokeOpacity,
      strokeWidth: this.strokeWidth,
      fillOpacity: this.fillOpacity,
      });
  }

  protected calculateDimensions(): void {
    const shapeOffset = this.strokeWidth / 2;
    this.shapeX = this.x + shapeOffset;
    this.shapeY = this.y + shapeOffset;
    this.shapeWidth =  this.cursorX - this.shapeX - shapeOffset;
    this.shapeHeight = this.cursorY - this.shapeY - shapeOffset;

    if (this.shiftDown ) { // Carré maximale Non centré...
      const minValue = Math.min(this.shapeHeight, this.shapeWidth);
      this.shapeHeight = minValue;
      this.shapeWidth = minValue;
    }
  }

}
