import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  
    lastColors = ['#222222ff', '#333333ff', '#444444ff', '#555555ff', '#777777ff',
                  '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#ddddddff', '#eeeeeeff'];
    alpha = [1, 1];
    mainColor = false;
    primaryColor = '#ffffffff';
    secondaryColor = '#000000ff';
    color = [this.primaryColor, this.secondaryColor]

    chooseColor(primary: boolean): void  {
      if (primary) {
        if (!this.mainColor) {this.mainColor = true;
        }
      } else {
        if (this.mainColor) {this.mainColor = false;
        }
      }
    }

    switchColors(): void {
      const intermediateColor = this.color[0];
      this.color[0] = this.color[1];
      this.color[1] = intermediateColor;
    }

    setAlpha(alpha: number): void  {
      this.alpha[+this.mainColor] = alpha;
      this.setColor(this.lastColors[9]);
    }

    setColor(color: string ): void  {
      this.color[+this.mainColor] = color;
    }
}
