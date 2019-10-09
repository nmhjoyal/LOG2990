import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {

    lastColors = ['#222222ff', '#333333ff', '#444444ff', '#555555ff', '#777777ff',
                  '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#ddddddff', '#eeeeeeff'];
    alpha = [100, 100];
    mainColor = false;
    primaryColor = '#ffffffff';
    secondaryColor = '#000000ff';
    color = [this.primaryColor, this.secondaryColor];

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

    rgbToHex(hue: number): string {
      if (!hue) {return '00'; } else if (hue < 16) {return ('0' + hue.toString(16)); } else {return hue.toString(16); }
    }

    setAlpha(alpha: number): void  {
      this.color[+this.mainColor] = this.color[+this.mainColor].slice(0, 7) + (this.rgbToHex(Math.round(alpha * 2.55)));
    }

    addColor( ): void  {
      let newColor = true;
      this.lastColors.forEach((element) => {
        if (element === this.color[+this.mainColor]) {
          newColor = false;
        }
      });
      if (newColor === true){
        this.lastColors.shift();
        this.lastColors.push(this.color[+this.mainColor]);
      }
    }

    setColor(color: string ): void  {
      this.color[+this.mainColor] = color;
    }
}
