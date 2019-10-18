import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ToolConstants } from '../../assets/tool-constants';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';
import { ColorService } from 'src/app/services/color_service/color.service';

@Component({
  selector: 'app-paintbrush',
  templateUrl: './paintbrush.component.html',
  styleUrls: ['./paintbrush.component.scss'],
})
export class PaintbrushComponent extends StrokeAbstract implements OnInit, OnDestroy {

  constructor(toolServiceRef: ToolHandlerService,
              attributeServiceRef: AttributesService,
              colorServiceRef: ColorService) {
    super(toolServiceRef, attributeServiceRef, colorServiceRef);
    this.stroke.id = ToolConstants.TOOL_ID.PAINTBRUSH;
  }

  saveAttribute(): void {
    this.attributesService.paintbrushAttributes.wasSaved = true;
    this.attributesService.paintbrushAttributes.savedStrokeWidth = this.stroke.strokeWidth;
    this.attributesService.paintbrushAttributes.savedFilter = this.stroke.filter;
  }

  ngOnInit(): void {
    if(this.attributesService.paintbrushAttributes.wasSaved) {
      this.stroke.strokeWidth = this.attributesService.paintbrushAttributes.savedStrokeWidth;
      this.stroke.filter = this.attributesService.paintbrushAttributes.savedFilter;
    }
  }

  ngOnDestroy(): void {
    this.saveAttribute();
  }

  setFilter(n: number): void {
    switch (n) {
      case 0:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER0;
        break;
      case 1:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER1;
        break;
      case 2:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER2;
        break;
      case 3:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER3;
        break;
      case 4:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER4;
        break;
      case 5:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER5;
        break;
      default:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER0;
        break;
    }
  }

}
