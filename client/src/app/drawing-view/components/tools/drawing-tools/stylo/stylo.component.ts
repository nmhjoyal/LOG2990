import { Component, OnInit, OnDestroy } from '@angular/core';
import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolConstants } from '../../assets/tool-constants';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { IStylo } from '../../assets/interfaces/drawing-tool-interface';

@Component({
  selector: 'app-stylo',
  templateUrl: './stylo.component.html',
  styleUrls: ['./stylo.component.scss']
})
export class StyloComponent extends StrokeAbstract implements OnInit, OnDestroy {

  stylo: IStylo;
  

  constructor(toolServiceRef: ToolHandlerService,
              attributesServiceRef: AttributesService,
              colorServiceRef: ColorService) {
    super(toolServiceRef, attributesServiceRef, colorServiceRef);
    this.stroke.id = ToolConstants.TOOL_ID.STYLO;
    this.stylo = {
      maxWidth: ToolConstants.DEFAULT_MAX_WIDTH,
      minWidth: ToolConstants.DEFAULT_MIN_WIDTH,
      speed: 0,
      lastTime: 0,
      lastPositionX: 0,
      lastPositionY: 0,
    }
  }

  ngOnInit(): void {
    if (this.attributesService.styloAttributes.wasSaved) {
      this.stylo.maxWidth = this.attributesService.styloAttributes.savedMaxWidth;
      this.stylo.minWidth = this.attributesService.styloAttributes.savedMinWidth;
    }
  }

  ngOnDestroy(): void {
    this.saveAttribute();
  }

  saveAttribute(): void {
    this.attributesService.styloAttributes.wasSaved = true;
    this.attributesService.styloAttributes.savedMaxWidth = this.stylo.maxWidth;
    this.attributesService.styloAttributes.savedMinWidth = this.stylo.minWidth;
  }

  decreaseMinWidth(): void {
    if(this.stylo.minWidth > 1){
      this.stylo.minWidth--;
    }
  }

  increaseMinWidth(): void {
    if(this.stylo.minWidth <= this.stylo.maxWidth){
      this.stylo.minWidth++;
    }
  }

  decreaseMaxWidth(): void {
    if(this.stylo.maxWidth >= this.stylo.minWidth){
      this.stylo.maxWidth--;
    }
  }

  increaseMaxWidth(): void {
    this.stylo.maxWidth++;
}

  onMouseMove(event: MouseEvent): void {
    if(this.mouseDown){

      this.stylo.speed = ClickHelper.calculateSpeed(event, this.stylo, Date.now());
      this.stylo.lastTime = Date.now();
      this.stylo.lastPositionX = ClickHelper.getXPosition(event);
      this.stylo.lastPositionY = ClickHelper.getYPosition(event);
      var newWidth: number;

      if(this.stylo.speed > ToolConstants.MAX_SPEED){
        newWidth = this.stylo.maxWidth;
      }
      else if(this.stylo.speed < ToolConstants.MIN_SPEED){
        newWidth = this.stylo.minWidth;
      }
      else {
        newWidth = Math.round(this.stylo.maxWidth * (this.stylo.speed - ToolConstants.MIN_SPEED )/ToolConstants.MAX_SPEED);
      }
      if(newWidth != this.stroke.strokeWidth){
        this.saveShape();
        this.onMouseDown(event);
        this.stroke.strokeWidth == newWidth;
      }
      else{
        super.onMouseMove(event);
      }
    }
  }


}
