import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Gridservice {

  i = 1;
  status = ['visible', 'hidden'];

  // strings received from app component (user input)

  userInputOpacity: string;
  userInputGridSize: string;

  toggleGrid(): void {
    this.i = 1 - this.i;
  }

  // Returns an object for [ngStyle]
  ngPathObject(): object {
      const pathString = '"M' + this.userInputGridSize + ',0 L0,0 0,' + this.userInputGridSize + '"';
      const cssPath = 'path(' + pathString + ')';
      return {d: cssPath};
  }

//

//

// Functional but code smell size setter

  setSizeSmell(): void {
    const gridElement = document.getElementById('smallGrid');
    const pathElement = document.getElementById('myPath');
    const value = (document.getElementById('sizeInput') as HTMLInputElement).value;
    const pathValue = "M"+ value + ",0 L0,0 0," + value;

    if (gridElement && pathElement) {
      pathElement.setAttribute("d", pathValue);
      gridElement.setAttribute("width", value);
      gridElement.setAttribute("height", value);
    }

  }
}
