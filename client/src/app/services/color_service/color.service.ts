import { Injectable } from '@angular/core';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { Strings } from 'src/AppConstants/Strings';

@Injectable({
  providedIn: 'root',
})
export class ColorService {

  color: string[] ;
  lastColors: string[] ;
  alpha: number[] ;
  mainColor: boolean ;

  constructor() {
    this.lastColors = ['#000000ff', '#222222ff', '#444444ff', '#666666ff', '#888888',
                       '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff'];
    this.mainColor = false;
    this.color = [Strings.WHITE_HEX, Strings.BLACK_HEX];
    this.alpha = [NumericalValues.INITIAL_TRANSPARENCY, NumericalValues.INITIAL_TRANSPARENCY];
  }

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
      const intermediateColor = this.color[ToolConstants.PRIMARY_COLOUR_INDEX];
      this.color[ToolConstants.PRIMARY_COLOUR_INDEX] = this.color[ToolConstants.SECONDARY_COLOUR_INDEX];
      this.color[ToolConstants.SECONDARY_COLOUR_INDEX] = intermediateColor;
    }

    rgbToHex(hue: number): string {
      if (!hue) {return '00';
      } else if (hue < NumericalValues.HEX_LENGTH) {return ('0' + hue.toString(NumericalValues.HEX_LENGTH));
      } else {return hue.toString(NumericalValues.HEX_LENGTH); }
    }

    setAlpha(alpha: number): void  {
      this.color[+this.mainColor] = this.color[+this.mainColor].slice(0, NumericalValues.HEX_NO_ALPHA)
                                    + (this.rgbToHex(Math.round(alpha * NumericalValues.RGBTOHEX_FACTOR)));
    }

    addColor( ): void  {
      let newColor = true;
      this.lastColors.forEach((element) => {
        if (element === this.color[+this.mainColor]) {
          newColor = false;
        }
      });
      if (newColor === true) {
        this.lastColors.shift();
        this.lastColors.push(this.color[+this.mainColor]);
      }
    }

    setColor(color: string): void  {
      this.color[+this.mainColor] = color;
    }
}
