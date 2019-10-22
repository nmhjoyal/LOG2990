import { Injectable } from '@angular/core';
import { NumericalValues } from 'src/AppConstants/NumericalValues';


@Injectable({
  providedIn: 'root',
})
export class GridService {

  i = 1;
  status = ['visible', 'hidden'];
  gridElement = document.getElementById('grid');

  toggleGrid(): void {
    this.i = 1 - this.i;
    const element = document.getElementById('grid');
    if (element != null) {
      element.style.visibility = this.status[this.i];
    }
  }

  setOpacity(): void {
    let stringValue = (document.getElementById('opacitySlider') as HTMLInputElement).value;
    const numberValue = Number(stringValue) / NumericalValues.GRID_MAX;      // Car 'slider' va de 0 à 100 pour plus de precision.
    stringValue = String(numberValue);              // Remettre en String.

    const element = document.getElementById('grid');
    if (element != null) {
      element.style.opacity = stringValue;
    } else {alert('Valeur attendue entre 0 et 1');}
  }

  setSize(value: string): void {
    const gridElement = document.getElementById('smallGrid');
    const pathElement = document.getElementById('myPath');
    const pathValue = 'M' + value + ',0 L0,0 0,' + value;
    if (gridElement != null && pathElement != null) {
      pathElement.setAttribute('d', pathValue);
      gridElement.setAttribute('width', value);
      gridElement.setAttribute('height', value);
    }

  }
}
