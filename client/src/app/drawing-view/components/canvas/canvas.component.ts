import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { NewDrawingModalData } from '../NewDrawingModalData';
import { MygridService } from '../../../services/mygrid/mygrid.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {

  gridElementC = document.getElementById('myGrid');
  sliderElementC: HTMLInputElement;

  constructor(@Inject(MAT_DIALOG_DATA) protected data: NewDrawingModalData, private gridsvc: MygridService) {
  }

  ngOnInit() {
    // empty block
  }

  @HostListener('document:keydown.g', ['$event']) onKeydownHandlerGrid(event: KeyboardEvent) {
    this.gridsvc.toggleGrid();
  }

  @HostListener('document:keydown.shift.+', ['$event']) onKeydownHandlerPlus(event: KeyboardEvent) {
    const sliderElement = document.getElementById('sizeSlider') as HTMLInputElement;
    const stringInitialValue = sliderElement.value;
    const initialValue = Number(stringInitialValue);
    let newValue;
    if (!(initialValue % 5)) {
      newValue = initialValue + 5;
    } else {
      newValue = Math.ceil(initialValue / 5) * 5;
    }
    const stringNewValue = String(newValue);

    if (sliderElement != null) {
      sliderElement.setAttribute('value', stringNewValue);
      this.gridsvc.setSize(stringNewValue);
    }

    this.sliderElementC = sliderElement;
  }

  @HostListener('document:keydown.-', ['$event']) onKeydownHandlerMinus(event: KeyboardEvent) {
    const sliderElement = document.getElementById('sizeSlider') as HTMLInputElement;
    const stringInitialValue = sliderElement.value;
    const initialValue = Number(stringInitialValue);
    let newValue;
    if (!(initialValue % 5)) {
      newValue = initialValue - 5;
    } else {
      newValue = Math.floor(initialValue / 5) * 5;
    }
    const stringNewValue = String(newValue);

    if (sliderElement != null) {
      sliderElement.setAttribute('value', stringNewValue);
      this.gridsvc.setSize(stringNewValue);
    }

    this.sliderElementC = sliderElement;
  }
}