import {  Component } from '@angular/core'


@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
})

export class ColorPickerComponent {
  color: Array<string> = ['#ffffffff', '#000000ff'] 
  colors: Array<string> = ['#222222ff', '#333333ff', '#444444ff', '#555555ff', '#777777ff',
                           '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#ddddddff', '#eeeeeeff'];
  alpha: Array<number> = [1, 1]
  mainColor = false


  chooseColor(primary: boolean){
    if (primary){
      if (!this.mainColor) {this.mainColor = true;
      }
    }
    else {
      if (this.mainColor) {this.mainColor = false;
      }
    }
  }

  switchColors(){
    const inter = this.color[0];
    this.color[0] = this.color[1];
    this.color[1] = inter;
  }

  setAlpha(alpha: number) {
    this.alpha[+this.mainColor] = alpha;
    this.setColor(this.colors[9]);
  }

  setColor(color: string ) {
    this.color[+this.mainColor] = color;
  }

}