import {  Component } from '@angular/core'


@Component({
  selector: 'app-color-inputs',
  templateUrl: './color-inputs.component.html',
  styleUrls: ['./color-inputs.component.css'],
})
export class ColorInputsComponent {
  public hue: string
  public color: string
  public color2: string
  public colors: Array<string> = []
  public alpha: number
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
/*
   setColor(color: string ){
    const rgbaColor = '#' + color + '01'
    this.color.emit('rgba(000000ff')

  }
*/
}