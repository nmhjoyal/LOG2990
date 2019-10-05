import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
})
export class ToolsComponent implements OnInit {

  constructor() {
    console.log('ToolsComponent constructed');
  }

  ngOnInit(): void {
    console.log('ToolsComponent initialized');
  }

}
