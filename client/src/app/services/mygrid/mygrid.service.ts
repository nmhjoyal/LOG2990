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
    let element = document.getElementById('myGrid');      // Chargé doesn't like this
    element.style.visibility = status[this.i]; 
    console.log(this.i);
  }

  setOpacity(value: number): void {
    let element = document.getElementById('myGrid');      // Chargé doesn't like this
    if (value <= 1 && value > 0) {
      element.style.opacity = value;
    }
    
    else alert('Valeur attendue entre 0 et 1');     // Validation
  }
}
