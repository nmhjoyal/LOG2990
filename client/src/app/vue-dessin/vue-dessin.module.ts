import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarreLateraleComponent } from './components/barre-laterale/barre-laterale.component';
import { CanevasComponent } from './components/canevas/canevas.component';
import { OutilsComponent } from './components/outils/outils.component';



@NgModule({
  declarations: [BarreLateraleComponent, CanevasComponent, OutilsComponent],
  imports: [
    CommonModule
  ]
})
export class VueDessinModule { }
