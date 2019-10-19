import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MygridService {

  i = 0;

  constructor() { }

  toggleGrid(): void {
    this.i = 1 - this.i;
    const status = ['visible', 'hidden'];
    let element = document.getElementById('myGrid');
    element.style.visibility = status[this.i]; 
    console.log(this.i);
  }

  setOpacity(value): void {
    let element = document.getElementById('myGrid');      
    if (value <= 1 && value > 0) {
      element.style.opacity = value;
    }
    
    else alert('Valeur attendue entre 0 et 1');
  }

  setSize(value): void {
    let gridElement = document.getElementById('smallGrid');
    let pathElement = document.getElementById('myPath');
    let pathValue = "M"+value+",0 L0,0 0,"+value;
    pathElement.setAttribute("d", pathValue);
    gridElement.setAttribute("width", value);
    gridElement.setAttribute("height", value);
  }
}
