import { Injectable } from '@angular/core';
import { NumericalValues } from 'src/AppConstants/NumericalValues';

@Injectable({
  providedIn: 'root',
})

export class Gridservice {

  gridStatus: boolean;
  gridOpacity: number;
  gridSize: number;

  constructor() {
    this.gridStatus = false;
    this.gridOpacity = 1;
    this.gridSize = 1;
  }

  toggleGrid(): void {
    this.gridStatus = !this.gridStatus;
    this.setGrid();
  }

  setGrid(): void {
    if (this.gridStatus) {
      this.gridOpacity = this.gridOpacity;
    } else {
      this.gridOpacity = 0;
    }
  }

// Functional but code smell size setter
/*
  setSizeSmell(): void {
    const gridElement = document.getElementById('smallGrid');
    const pathElement = document.getElementById('myPath');
    const value = (document.getElementById('sizeInput') as HTMLInputElement).value;
    const pathValue = 'M' + value + ',0 L0,0 0,' + value;

    if (gridElement && pathElement) {
      pathElement.setAttribute('d', pathValue);
      gridElement.setAttribute('width', value);
      gridElement.setAttribute('height', value);
    }

  }*/
  drawGrid(): void {
    var cnv = document.getElementById("cnv");

    var gridOptions = {
        minorLines: {
            separation: 5,
            color: '#00FF00'
        },
        majorLines: {
            separation: 30,
            color: '#FF0000'
        }
    };

    this.drawGridLines(cnv, gridOptions.minorLines);
    this.drawGridLines(cnv, gridOptions.majorLines);
}

 drawGridLines(cnv: any, lineOptions: any) {

    var iWidth = cnv.width;
    var iHeight = cnv.height;

    var ctx = cnv.getContext('2d');

    ctx.strokeStyle = lineOptions.color;
    ctx.strokeWidth = 1;

    ctx.beginPath();

    var iCount = null;
    var i = null;
    var x = null;
    var y = null;

    iCount = Math.floor(iWidth / lineOptions.separation);

    for (i = 1; i <= iCount; i++) {
        x = (i * lineOptions.separation);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, iHeight);
        ctx.stroke();
    }


    iCount = Math.floor(iHeight / lineOptions.separation);

    for (i = 1; i <= iCount; i++) {
        y = (i * lineOptions.separation);
        ctx.moveTo(0, y);
        ctx.lineTo(iWidth, y);
        ctx.stroke();
    }

    ctx.closePath();
}

  decreaseSize(): void {
    if (this.gridSize > NumericalValues.MIN_GRID_SIZE) {
      this.gridSize--;
      }
  }

  increaseSize(): void {
    if (this.gridSize < NumericalValues.MAX_GRID_SIZE) {
      this.gridSize++;
      }
  }

}
