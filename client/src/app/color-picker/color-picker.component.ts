import {  Component } from '@angular/core'


@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
})
export class ColorPickerComponent {
  public color: string
  public color2: string
  public colors: Array<string> = ["#222","#333", "#444", "#555", "grey", "#aaa", "#bbb", "#ccc", "#ddd", "#eee"]
  public alpha: number = 1
  public mainColor: boolean


/*
  setAlpha(){
   // this.color = color[0:5] + alpha;
    

  }
*/
  chooseColor1()
{
    document.getElementById('primary').setAttribute("main-color", "clicked-color");
    this.mainColor = true;
}

chooseColor2()
{
    document.getElementById('secondary').setAttribute("main-color", "clicked-color");
    this.mainColor = false;
}

switchColors(){
  let inter = this.color
  this.color = this.color2
  this.color2 = inter
}
/*
   setColor(color: string ){
    const rgbaColor = '#' + color + '01'
    this.color.emit('rgba(000000ff')

  }
*/
}