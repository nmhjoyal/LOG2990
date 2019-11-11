import { Injectable } from '@angular/core';
import { ColourConstants, GrayScale } from 'src/app/drawing-view/components/tools/assets/constants/colour-constants';
import { Strings } from 'src/AppConstants/Strings';

@Injectable({
  providedIn: 'root',
})
export class ColourService {

  colour: string[] ;
  lastColours: string[] ;
  alpha: number[] ;
  mainColour: boolean ;

  constructor() {
    this.lastColours = [GrayScale.BLACK, GrayScale.GREY1, GrayScale.GREY2, GrayScale.GREY3, GrayScale.GREY4,
                        GrayScale.GREY5, GrayScale.GREY6, GrayScale.GREY7, GrayScale.GREY8, GrayScale.WHITE ];
    this.colour = [Strings.BLACK_HEX, Strings.WHITE_HEX];
    this.alpha = [ColourConstants.INITIAL_TRANSPARENCY, ColourConstants.INITIAL_TRANSPARENCY];
    this.mainColour = false;
  }

    chooseColour(primary: boolean): void  {
      if (primary) {
        if (!this.mainColour) {this.mainColour = true;
        }
      } else {
        if (this.mainColour) {this.mainColour = false;
        }
      }
    }

    switchColours(): void {
      const intermediateColour = this.colour[0];
      this.colour[0] = this.colour[1];
      this.colour[1] = intermediateColour;
    }

    rgbToHex(hue: number): string {
      if (!hue) {return '00';
      } else if (hue < ColourConstants.HEX_LENGTH) {return ('0' + hue.toString(ColourConstants.HEX_LENGTH));
      } else {return hue.toString(ColourConstants.HEX_LENGTH); }
    }

    setAlpha(alpha: number): void  {
      this.colour[+this.mainColour] = this.colour[+this.mainColour].slice(0, ColourConstants.HEX_NO_ALPHA)
                                    + (this.rgbToHex(Math.round(alpha * ColourConstants.RGBTOHEX_FACTOR)));
    }

    addColour( ): void  {
      let newColour = true;
      this.lastColours.forEach((element) => {
        if (element === this.colour[+this.mainColour]) {
          newColour = false;
        }
      });
      if (newColour) {
        this.lastColours.shift();
        this.lastColours.push(this.colour[+this.mainColour]);
      }
    }

    setColour(colour: string): void  {
      this.colour[+this.mainColour] = colour;
    }
}