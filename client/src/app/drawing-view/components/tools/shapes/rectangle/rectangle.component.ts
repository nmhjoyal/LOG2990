import { Component } from '@angular/core';
import { ShapeAbstract } from '../assets/shape-abstract'
import { ShapeService } from '../assets/shape.service';

@Component({
  selector: 'app-tools-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent extends ShapeAbstract {

  constructor(myShapeService: ShapeService) {
    super(myShapeService);
    }

  ngOnInit() {
  }

  // Abstract&Overridden methods

  protected saveShape(): void{
    this._shapeService.rectangles.push(
      {x: this.getShapeX(),
      y: this.getShapeY(),
      width: this.getShapeWidth(),
      height: this.getShapeHeight(),
      primeColor: this.getPrimeColor(),
      secondColor: this.getSecondColor(),
      strokeOpacity: this.getStrokeOpacity(),
      strokeWidth: this.getStrokeWidth(),
      fillOpacity: this.getFillOpacity()
      });
  }

  protected calculateDimensions(): void{
    let shapeOffset = this.getStrokeWidth()/2;
    this._shapeX = this._x + shapeOffset;
    this._shapeY = this._y + shapeOffset;
    this._shapeWidth =  this._cursorX- this._shapeX - shapeOffset;
    this._shapeHeight = this._cursorY - this._shapeY - shapeOffset;

    if(this._shiftDown){//Carré maximale Non centré...
      let minValue = Math.min(this._shapeHeight, this._shapeWidth);
      this._shapeHeight = minValue;
      this._shapeWidth = minValue;
    }
  }

}
/***************************************
 * INTERESTING LINKS*
 * https://stackoverflow.com/questions/50848357/what-is-the-purpose-of-providedin-with-the-injectable-decorator-when-generating
 *https://www.sarasoueidan.com/blog/svg-coordinate-systems/
 *https://www.w3.org/TR/SVG2/render.html#EstablishingStackingContex
 *https://medium.com/@mirokoczka/3-ways-to-communicate-between-angular-components-a1e3f3304ecb
 *https://www.chrisjmendez.com/2017/06/17/angular-dynamically-inserting-svg-into-an-element/
 *https://teropa.info/blog/2016/12/12/graphics-in-angular-2.html#namespacing-svg-elements
 *https://medium.com/claritydesignsystem/four-ways-of-listening-to-dom-events-in-angular-part-2-hostlistener-1b66d45b3e3d
 */
