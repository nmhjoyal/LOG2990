import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Gridservice {

  i = 1;
  status = ['visible', 'hidden'];
  gridElement = document.getElementById('myGrid');
  sliderElement = document.getElementById('sizeSlider') as HTMLInputElement;        // For testing

  constructor() { }

  toggleGrid(): void {
    this.i = 1 - this.i;
    let element = document.getElementById('myGrid');
    if (element) {
      element.style.visibility = this.status[this.i]; 
    }
  }

  setOpacity(): void {
    let stringValue = (document.getElementById('opacitySlider') as HTMLInputElement).value;
    let numberValue = Number(stringValue)/100;      // Car 'slider' va de 0 à 100 pour plus de precision.
    stringValue = String(numberValue)               // Remettre en String.

    let element = document.getElementById('myGrid');      
    if (element) {
      element.style.opacity = stringValue;
    }
  }

  // FOR TESTING PURPOSES ONLY
  // ****************************************

  setOpacityManual(value: string): void {

    let element = document.getElementById('myGrid');      
    if (element) {
      element.style.opacity = value;
    }
  }

  // ****************************************

  setSize(): void {
    let gridElement = document.getElementById('smallGrid');
    let pathElement = document.getElementById('myPath');
    let value = (document.getElementById('sizeSlider') as HTMLInputElement).value;
    let pathValue = "M"+value+",0 L0,0 0,"+value;
    
    if (gridElement && pathElement) {
      pathElement.setAttribute("d", pathValue);
      gridElement.setAttribute("width", value);
      gridElement.setAttribute("height", value);
    }

  }
}
