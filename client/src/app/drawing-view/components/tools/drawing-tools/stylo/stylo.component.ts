import { Component, OnInit, OnDestroy } from '@angular/core';
import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolConstants } from '../../assets/tool-constants';

@Component({
  selector: 'app-stylo',
  templateUrl: './stylo.component.html',
  styleUrls: ['./stylo.component.scss']
})
export class StyloComponent extends StrokeAbstract implements OnInit, OnDestroy {

  maxWidth: number;
  minWidth: number;

  constructor(toolServiceRef: ToolHandlerService,
              attributesServiceRef: AttributesService,
              colorServiceRef: ColorService) {
    super(toolServiceRef, attributesServiceRef, colorServiceRef);
    this.stroke.id = ToolConstants.TOOL_ID.STYLO;
    this.maxWidth = ToolConstants.DEFAULT_MAX_WIDTH;
    this.minWidth = ToolConstants.DEFAULT_MIN_WIDTH;
  }

  ngOnInit(): void {
    if (this.attributesService.styloAttributes.wasSaved) {
      this.maxWidth = this.attributesService.styloAttributes.savedMaxWidth;
      this.minWidth = this.attributesService.styloAttributes.savedMinWidth;
    }
  }

  ngOnDestroy(): void {
    this.saveAttribute();
  }

  saveAttribute(): void {
    this.attributesService.styloAttributes.wasSaved = true;
    this.attributesService.styloAttributes.savedMaxWidth = this.maxWidth;
    this.attributesService.styloAttributes.savedMinWidth = this.minWidth;
  }

  decreaseMinWidth(): void {
    if(this.minWidth > 1){
      this.minWidth--;
    }
  }

  increaseMinWidth(): void {
    if(this.minWidth <= this.maxWidth){
      this.minWidth++;
    }
  }

  decreaseMaxWidth(): void {
    if(this.maxWidth >= this.minWidth){
      this.maxWidth--;
    }
  }

  increaseMaxWidth(): void {
    this.maxWidth++;
}

}
