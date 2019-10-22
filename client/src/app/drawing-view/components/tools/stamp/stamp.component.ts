import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../assets/attributes/attributes.service';
import { IStamp } from '../assets/interfaces/stamp-interface';
import { FilterSelection, Id, ToolConstants } from '../assets/tool-constants';
import { NumericalValues } from 'src/AppConstants/NumericalValues';


const DEFAULT_ANGLE = 90;
const DEFAULT_DIMENSION = 24;
const PATH_SLICER = 6;
const DEFAULT_SCALE_FACTOR = 1;

@Component({
  selector: 'app-tools-stamp',
  templateUrl: './stamp.component.html',
  styleUrls: ['./stamp.component.scss'],
})
export class StampComponent implements OnInit, OnDestroy {

  @Input() windowHeight: number;
  @Input() windowWidth: number;
  stamp: IStamp;

  constructor(protected toolServiceRef: ToolHandlerService, protected attributesServiceRef: AttributesService,
    protected colorServiceRef: ColorService) {
    this.stamp = {
      id: Id.STAMP,
      svgReference: '',
      angle: DEFAULT_ANGLE,
      scaleFactor: DEFAULT_SCALE_FACTOR,
      x: ToolConstants.NULL,
      y: ToolConstants.NULL,
      width: DEFAULT_DIMENSION,
      height: DEFAULT_DIMENSION,
    };
  }

  ngOnInit(): void {
    if (this.attributesServiceRef.stampAttributes.wasSaved) {
      this.stamp.angle = this.attributesServiceRef.stampAttributes.savedAngle;
      this.stamp.scaleFactor = this.attributesServiceRef.stampAttributes.savedScaleFactor;
    }
  }

  ngOnDestroy(): void {
    this.attributesServiceRef.stampAttributes.savedAngle = this.stamp.angle;
    this.attributesServiceRef.stampAttributes.savedScaleFactor = this.stamp.scaleFactor;
    this.attributesServiceRef.stampAttributes.wasSaved = true;
  }

  @HostListener('click', ['$event']) onLeftClick(event: MouseEvent): void {
    if (this.stamp.svgReference !== ''){
      this.stamp.x = event.offsetX - this.stamp.width / NumericalValues.TWO;
      this.stamp.y = event.offsetY - this.stamp.height / NumericalValues.TWO;

      const createdStamp: IStamp = {
        id: this.stamp.id,
        svgReference: this.stamp.svgReference.slice(PATH_SLICER),
        x: this.stamp.x,
        y: this.stamp.y,
        width: this.stamp.width,
        height: this.stamp.height,
        angle: this.stamp.angle,
        scaleFactor: this.stamp.scaleFactor,
      }
      
        this.toolServiceRef.drawings.push(createdStamp);
    }
  }

  setStamp(stampIndex: number): void {
    switch (stampIndex) {
      case (FilterSelection.FILTER0):
        this.stamp.svgReference = '../../../../../../assets/stamps/grade-24px.svg';
        break;
      case (FilterSelection.FILTER1):
        this.stamp.svgReference = '../../../../../../assets/stamps/pets-24px.svg';
        break;
      case (FilterSelection.FILTER2):
        this.stamp.svgReference = '../../../../../../assets/stamps/sentiment_satisfied_alt-24px.svg';
        break;
      case (FilterSelection.FILTER3):
        this.stamp.svgReference = '../../../../../../assets/stamps/favorite-24px.svg';
        break;
      case (FilterSelection.FILTER4):
        this.stamp.svgReference = '../../../../../../assets/stamps/thumb_up-24px.svg';
        break;
      case (FilterSelection.FILTER5):
        this.stamp.svgReference = '../../../../../../assets/stamps/brightness_5-24px.svg';
        break;
    }
  }

  increaseScaleFactor(): void {
    this.stamp.scaleFactor += 1;
    this.stamp.width = this.stamp.width * this.stamp.scaleFactor;
  }

  increaseAngle(): void {
    this.stamp.angle += 1;
  }

  decreaseScaleFactor(): void {
    if (!(this.stamp.scaleFactor - 1 < 0)) {
      this.stamp.scaleFactor -= 1;
      this.stamp.width = this.stamp.width / this.stamp.scaleFactor;
    }
  }

  decreaseAngle(): void {
    if (!(this.stamp.angle - 1 < 0)) {
      this.stamp.angle -= 1;
    }
  }
}
