import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lateral-bar',
  templateUrl: './lateral-bar.component.html',
  styleUrls: ['./lateral-bar.component.scss'],
})
export class LateralBarComponent implements OnInit {

  constructor() {
    console.log('lateral bar constructor');
   }

  ngOnInit() {
    console.log('lateral bar initialized');
  }
}
