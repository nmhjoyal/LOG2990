import {VueDessinComponent} from '../components/vue-dessin/vue-dessin.component';
import {HomeSweetHomeComponent} from '../components/home-sweet-home/home-sweet-home.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {path: '', component: HomeSweetHomeComponent},
    {path: 'home', component: VueDessinComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { } 