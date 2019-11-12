import { Injectable } from '@angular/core';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { Strings } from 'src/AppConstants/Strings';

@Injectable({
  providedIn: 'root',
})
export class ColourService {

  colour: string[] ;
  protected lastColours: string[] ;
  protected alpha: number[] ;
  protected mainColour: boolean ;

  constructor() {
    this.lastColours = ['#000000ff', '#222222ff', '#444444ff', '#666666ff', '#888888',
                       '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff'];
    this.mainColour = false;
    this.colour = [Strings.BLACK_HEX, Strings.WHITE_HEX];
    this.alpha = [NumericalValues.INITIAL_TRANSPARENCY, NumericalValues.INITIAL_TRANSPARENCY];
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
      const intermediateColour = this.colour[ToolConstants.PRIMARY_COLOUR_INDEX];
      this.colour[ToolConstants.PRIMARY_COLOUR_INDEX] = this.colour[ToolConstants.SECONDARY_COLOUR_INDEX];
      this.colour[ToolConstants.SECONDARY_COLOUR_INDEX] = intermediateColour;
    }

    rgbToHex(hue: number): string {
      if (!hue) {return '00';
      } else if (hue < NumericalValues.HEX_LENGTH) {return ('0' + hue.toString(NumericalValues.HEX_LENGTH));
      } else {return hue.toString(NumericalValues.HEX_LENGTH); }
    }

    setAlpha(alpha: number): void  {
      this.colour[+this.mainColour] = this.colour[+this.mainColour].slice(0, NumericalValues.HEX_NO_ALPHA)
                                    + (this.rgbToHex(Math.round(alpha * NumericalValues.RGBTOHEX_FACTOR)));
    }

    addColour( ): void  {
      let newColour = true;
      this.lastColours.forEach((element) => {
        if (element === this.colour[+this.mainColour]) {
          newColour = false;
        }
      });
      if (newColour === true) {
        this.lastColours.shift();
        this.lastColours.push(this.colour[+this.mainColour]);
      }
    }

    setColour(colour: string): void  {
      this.colour[+this.mainColour] = colour;
    }
}
