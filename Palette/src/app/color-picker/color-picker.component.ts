import {  Component } from '@angular/core'


@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
})
export class ColorPickerComponent {
  public hue: string
  public color: string
  public colors: Array<string>
  public alpha: string


  setAlpha(){
   // this.color = color[0:5] + alpha;
    

  }
/*
   setColor(color: string ){
    const rgbaColor = '#' + color + '01'
    this.color.emit('rgba(000000ff')

  }
*/

}