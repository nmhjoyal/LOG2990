import { Injectable } from '@angular/core';

/*************************************************************************
 * THIS SERVICE IS A PLACEHOLDER TO TEST THE RECTANGLE'S FUNCTIONALITIES *
 *************************************************************************/

@Injectable({
  providedIn: 'root',
})
export class ShapeService {

  canvasHeight = 700;
  canvasWidth = 400;
  primaryColour = 'green';
  secondaryColour = 'rgb(76, 24, 199)';

  rectangles: {x: number, y: number, width: number, height: number,
                    primeColor: string, secondColor: string
                    strokeOpacity: number, strokeWidth: number, fillOpacity: number}[] = [];

  constructor() { }

  switchColor() {// pour test de la sauvegarde de couleur dans le array
    this.primaryColour = 'rgb('
                          + Math.floor(Math.random() * 255)
                          + ',' + Math.floor(Math.random() * 255)
                          + ','  + Math.floor(Math.random() * 255)
                          + ')';
    this.secondaryColour = 'rgb('
                            + Math.floor(Math.random() * 255)
                            + ',' + Math.floor(Math.random() * 255)
                            + ','  + Math.floor(Math.random() * 255)
                            + ')';
  }

  getHeight() {
    return this.canvasHeight;
  }

  getWidth() {
    return this.canvasWidth;
  }

}
