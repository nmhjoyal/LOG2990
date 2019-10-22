import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MygridService {

  i = 1;
  status = ['visible', 'hidden'];
  gridElement = document.getElementById('myGrid');

  constructor() { }

  toggleGrid(): void {
    this.i = 1 - this.i;
    let element = document.getElementById('myGrid');
    if (element != null) {
      element.style.visibility = this.status[this.i]; 
    }
    
    console.log(this.i);
  }

  setOpacity(value : string): void {
    let element = document.getElementById('myGrid');      
    if (element != null) {
      element.style.opacity = value;
    }
    
    else alert('Valeur attendue entre 0 et 1');
  }

  setSize(value: string): void {
    let gridElement = document.getElementById('smallGrid');
    let pathElement = document.getElementById('myPath');
    let pathValue = "M"+value+",0 L0,0 0,"+value;
    if (gridElement != null && pathElement != null) {
      pathElement.setAttribute("d", pathValue);
      gridElement.setAttribute("width", value);
      gridElement.setAttribute("height", value);
    }

  }
}
