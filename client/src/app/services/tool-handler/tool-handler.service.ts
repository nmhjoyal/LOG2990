import { Injectable } from '@angular/core';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { ColorService } from '../color_service/color.service';

@Injectable({
  providedIn: 'root',
})
export class ToolHandlerService {

  // Shape Handling attributes
  noneSelected: boolean;
  rectangleSelected: boolean;
  colourApplicatorSelected: boolean;
  crayonSelected: boolean;
  pinceauSelected: boolean;
  lineSelected: boolean;
  paintbrushSelected: boolean;
  primaryColorSelected: boolean;
  secondaryColorSelected: boolean;
​
// Color service simulating attributes
primaryColor: string;
secondaryColor: string;
​
// drawings Storage
drawings: ITools[] = [];

  constructor(public colorService: ColorService) {
    this.drawings = [];
    this.noneSelected = true;
    this.rectangleSelected = false;
    this.crayonSelected = false;
    this.pinceauSelected = false;
    this.lineSelected = false;
    this.paintbrushSelected = false;
    this.primaryColorSelected = false;
    this.secondaryColorSelected = false;
    this.primaryColor = this.colorService.color[0];
    this.secondaryColor = this.colorService.color[1];
  }
​
// Tool Handling methods
clearPage(): void {
    this.resetSelection();
    this.drawings.length = 0;
}
​
resetSelection(): void {
    this.noneSelected = true;
    this.rectangleSelected = false;
    this.crayonSelected = false;
    this.pinceauSelected = false;
    this.lineSelected = false;
    this.paintbrushSelected = false;
  }
​
  chooseRectangle(): void {
      this.resetSelection();
      this.rectangleSelected = true;
      this.noneSelected = false;
  }

  chooseLine(): void {
    this.resetSelection();
    this.lineSelected = true;
    this.noneSelected = false;
}
​
chooseCrayon(): void {
    this.resetSelection();
    this.crayonSelected = true;
    this.noneSelected = false;
}
​
  choosePaintbrush(): void {
      this.resetSelection();
      this.paintbrushSelected = true;
      this.noneSelected = false;
  }

  choosePrimaryColor(): void {
    this.resetSelection();
    this.primaryColorSelected = true;
    this.noneSelected = false;
    this.colorService.chooseColor(false);
  }  ​

  chooseSecondaryColor(): void {
    this.resetSelection();
    this.secondaryColorSelected = true;
    this.noneSelected = false;
    this.colorService.chooseColor(true);
  }  ​

  chooseOther(): void {// Place holder for unimplemented tools
      this.resetSelection();
  }
​
}
