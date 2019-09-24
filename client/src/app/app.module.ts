import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './components/app/app.component';
import { DrawingViewModule } from './drawing-view/drawing-view.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DrawingViewModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
