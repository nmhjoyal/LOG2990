import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing/app-routing.module';
import {AppComponent} from './components/app/app.component';
import { VueDessinComponent } from './components/vue-dessin/vue-dessin.component';
import { HomeSweetHomeComponent } from './components/home-sweet-home/home-sweet-home.component';

@NgModule({
  declarations: [
    AppComponent,
    VueDessinComponent,
    HomeSweetHomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
