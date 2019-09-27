import { Component, OnInit, Input } from '@angular/core';
import { ShapeAbstract } from '../assets/shape-abstract';

@Component({
  selector: 'app-shape-toolbox',
  templateUrl: './shape-toolbox.component.html',
  styleUrls: ['./shape-toolbox.component.scss']
})
export class ShapeToolboxComponent implements OnInit {

  @Input() shapeComponent: ShapeAbstract;

  constructor() { }

  ngOnInit() {
  }

  getComponent(): ShapeAbstract{
    return this.shapeComponent;
  }

}
