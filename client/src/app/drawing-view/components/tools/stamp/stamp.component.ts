import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { ToolAbstract } from '../assets/abstracts/tool-abstract/tool-abstract';
import { AttributesService } from '../assets/attributes/attributes.service';
import { StampConstants } from '../assets/constants/stamp-constants';
import { FilterSelection, Id, ToolConstants } from '../assets/constants/tool-constants';
import { IStamp } from '../assets/interfaces/stamp-interface';

@Component({
  selector: 'app-tools-stamp',
  templateUrl: './stamp.component.html',
  styleUrls: ['./stamp.component.scss'],
})
export class StampComponent extends ToolAbstract implements OnInit, OnDestroy {

  @Input() windowHeight: number;
  @Input() windowWidth: number;
  stamp: IStamp;
  angle: number;

  constructor(protected toolServiceRef: ToolHandlerService, protected attributesServiceRef: AttributesService,
    protected colorServiceRef: ColorService) {
    super();
    this.angle = 0;
    this.stamp = {
      id: Id.STAMP,
      svgReference: '',
      angle: StampConstants.DEFAULT_ANGLE,
      scaleFactor: StampConstants.DEFAULT_SCALE_FACTOR,
      primaryColour: colorServiceRef.color[ToolConstants.PRIMARY_COLOUR_INDEX],
      x: ToolConstants.NULL,
      y: ToolConstants.NULL,
      width: StampConstants.DEFAULT_DIMENSION,
      height: StampConstants.DEFAULT_DIMENSION,
      centerX: ToolConstants.NULL,
      centerY: ToolConstants.NULL,
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
    if (this.stamp.svgReference !== '') {
      this.stamp.x = ClickHelper.getXPosition(event) - this.stamp.width / NumericalValues.TWO;
      this.stamp.y = ClickHelper.getYPosition(event) - this.stamp.height / NumericalValues.TWO;
      if (this.stamp.svgReference !== undefined) {
        const createdStamp: IStamp = {
          id: this.stamp.id,
          svgReference: this.stamp.svgReference.slice(StampConstants.PATH_SLICER),
          primaryColour: this.stamp.primaryColour,
          x: this.stamp.x,
          y: this.stamp.y,
          width: this.stamp.width,
          height: this.stamp.height,
          angle: this.angle,
          scaleFactor: this.stamp.scaleFactor,
          centerX: ClickHelper.getXPosition(event),
          centerY: ClickHelper.getYPosition(event),
        };
        this.toolServiceRef.drawings.push(createdStamp);
      }
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

  multiplyScaleFactor(): void {
    this.stamp.width = StampConstants.DEFAULT_WIDTH * this.stamp.scaleFactor;
    this.stamp.height = StampConstants.DEFAULT_HEIGHT * this.stamp.scaleFactor;
  }

  increaseScaleFactor(): void {
    if (this.stamp.scaleFactor + 1 < StampConstants.MAX_SCALE) {
      this.stamp.scaleFactor++;
      this.multiplyScaleFactor();
    }
  }

  decreaseScaleFactor(): void {
    if (!(this.stamp.scaleFactor - 1 < 0)) {
      this.stamp.scaleFactor--;
      this.multiplyScaleFactor();
    }
  }
}
