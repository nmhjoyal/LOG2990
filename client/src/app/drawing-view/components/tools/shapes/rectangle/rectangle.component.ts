import { Component } from '@angular/core';
import { ShapeAbstract } from '../assets/shape-abstract';
import { ShapeService } from '../assets/shape.service';

@Component({
  selector: 'app-tools-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent extends ShapeAbstract {

  constructor(myShapeService: ShapeService) {
    super(myShapeService);
    }

  ngOnInit() {
  }

  // Abstract&Overridden methods

  protected saveShape(): void {
    this._shapeService.rectangles.push(
      {x: this.getShapeX(),
      y: this.getShapeY(),
      width: this.getShapeWidth(),
      height: this.getShapeHeight(),
      primeColor: this.getPrimeColor(),
      secondColor: this.getSecondColor(),
      strokeOpacity: this.getStrokeOpacity(),
      strokeWidth: this.getStrokeWidth(),
      fillOpacity: this.getFillOpacity(),
      });
  }

  protected calculateDimensions(): void {
    const shapeOffset = this.getStrokeWidth()/2;
    this._shapeX = this._x + shapeOffset;
    this._shapeY = this._y + shapeOffset;
    this._shapeWidth =  this._cursorX - this._shapeX - shapeOffset;
    this._shapeHeight = this._cursorY - this._shapeY - shapeOffset;

    if (this._shiftDown ){ //Carré maximale Non centré...
      const minValue = Math.min(this._shapeHeight, this._shapeWidth);
      this._shapeHeight = minValue;
      this._shapeWidth = minValue;
    }
  }

}