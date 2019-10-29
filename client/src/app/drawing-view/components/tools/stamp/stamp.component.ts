import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { ToolAbstract } from '../assets/abstracts/tool-abstract/tool-abstract';
import { AttributesService } from '../assets/attributes/attributes.service';
import { IStamp } from '../assets/interfaces/stamp-interface';
import { FilterSelection, Id, StampConstants, ToolConstants } from '../assets/tool-constants';

@Component({
  selector: 'app-tools-stamp',
  templateUrl: './stamp.component.html',
  styleUrls: ['./stamp.component.scss'],
})
export class StampComponent extends ToolAbstract implements OnInit, OnDestroy {

  @Input() windowHeight: number;
  @Input() windowWidth: number;
  stamp: IStamp;
  stampPaths = StampConstants.STAMPS_PATHS;
  angleIncrement: number;

  constructor(protected toolServiceRef: ToolHandlerService, protected attributesServiceRef: AttributesService,
    protected colorServiceRef: ColorService) {
      super();
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
      centerX : ToolConstants.NULL,
      centerY: ToolConstants.NULL,
    };
    this.angleIncrement = StampConstants.ANGLE_INCREMENT_1;
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
      this.stamp.x = event.offsetX - this.stamp.width / NumericalValues.TWO;
      this.stamp.y = event.offsetY - this.stamp.height / NumericalValues.TWO;
      this.stamp.centerX = event.offsetX;
      this.stamp.centerY = event.offsetY;

      const createdStamp: IStamp = {
        id: this.stamp.id,
        svgReference: this.stamp.svgReference.slice(StampConstants.PATH_SLICER),
        primaryColour: this.stamp.primaryColour,
        x: this.stamp.x,
        y: this.stamp.y,
        width: this.stamp.width,
        height: this.stamp.height,
        angle: this.stamp.angle,
        scaleFactor: this.stamp.scaleFactor,
        centerX: this.stamp.centerX,
        centerY: this.stamp.centerY,
      };
      this.toolServiceRef.drawings.push(createdStamp);
    }
  }

  @HostListener('wheel', ['$event']) onWheel(event: WheelEvent): void {
    const valueChange = event.deltaY > 0 ? this.angleIncrement : - this.angleIncrement;
    this.stamp.angle += valueChange;
  }

  @HostListener('keydown.alt') onKeyDownAltEvent(): void {
    this.angleIncrement = this.angleIncrement === StampConstants.ANGLE_INCREMENT_1 ?
      this.angleIncrement = StampConstants.ANGLE_INCREMENT_15 :
      this.angleIncrement = StampConstants.ANGLE_INCREMENT_1;
  }

  setStamp(stampIndex: number): void {
    switch (stampIndex) {
      case (FilterSelection.FILTER0):
        this.stamp.svgReference = this.stampPaths.HEART;
        break;
      case (FilterSelection.FILTER1):
        this.stamp.svgReference = this.stampPaths.PAW;
        break;
      case (FilterSelection.FILTER2):
        this.stamp.svgReference = this.stampPaths.SMILEY;
        break;
      case (FilterSelection.FILTER3):
        this.stamp.svgReference = this.stampPaths.STAR;
        break;
      case (FilterSelection.FILTER4):
        this.stamp.svgReference = this.stampPaths.THUMB_UP;
        break;
      case (FilterSelection.FILTER5):
        this.stamp.svgReference = this.stampPaths.SUN;
        break;
    }
  }

  multiplyScaleFactor(): void {
    this.stamp.width = StampConstants.DEFAULT_WIDTH * this.stamp.scaleFactor;
    this.stamp.height = StampConstants.DEFAULT_HEIGHT * this.stamp.scaleFactor;
  }

  increaseScaleFactor(): void {
    if (this.stamp.scaleFactor < StampConstants.MAX_SCALE) {
      this.stamp.scaleFactor += 1;
      this.multiplyScaleFactor();
    }
  }

  decreaseScaleFactor(): void {
    if (!(this.stamp.scaleFactor === 0)) {
      this.stamp.scaleFactor -= 1;
      this.multiplyScaleFactor();
    }
  }

  increaseAngle(): void {
    this.stamp.angle += 1;
  }

  decreaseAngle(): void {
    if (!(this.stamp.angle === 0)) {
      this.stamp.angle -= 1;
    }
  }
}
