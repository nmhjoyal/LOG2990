import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lateral-bar',
  templateUrl: './lateral-bar.component.html',
  styleUrls: ['./lateral-bar.component.scss'],
})
export class LateralBarComponent implements OnInit {

  constructor() {
    console.log('LateralBarComponent constructor');
   }

  ngOnInit(): void {
    console.log('LateralBarComponent initialized');
  }
}
