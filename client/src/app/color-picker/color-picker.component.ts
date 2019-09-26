import {  Component, ViewChild } from '@angular/core'


@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
})
export class ColorPickerComponent {
  public color: string = 'rgba(0,0,0,0)'
  public color2: string = 'rgba(100,100,100,1)'
  public colors: Array<string> = ["#222","#333", "#444", "#555", "#777", "#aaa", "#bbb", "#ccc", "#ddd", "#eee"]
  public alpha: number = 1
  public mainColor: boolean = true


  chooseColor(primary: boolean)
{
   
    if (primary == true){
      if (this.mainColor == false){
        this.mainColor = true;
      }
    }
    else{
      if (this.mainColor == true){
        this.mainColor = false;
      }
    }
}
/*
chooseColor2()
{
    //document.getElementById('secondary').setAttribute("main-color", "clicked-color");
    this.mainColor = false;
}*/

switchColors(){
  let inter = this.color
  this.color = this.color2
  this.color2 = inter
}

setAlpha(alpha: number){
  //"app-color-palette.setAlpha(alpha)"
    this.alpha = alpha;
    //this.setColor(this.colors[9]);
} 

setColor(color: string ){
  
  

    if(this.mainColor) this.color = color 
      
    else this.color2 = color
  
  
 }

 isHexColor (color: string) {
   if(color.match("#([0-9A-F]{6}$/i.test('#AABBCC')")){
     this.setColor(color);
   }
}


}