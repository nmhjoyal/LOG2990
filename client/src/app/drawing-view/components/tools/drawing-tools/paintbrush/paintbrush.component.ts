import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { FilterSelection, ToolConstants } from '../../assets/constants/tool-constants';

@Component({
  selector: 'app-paintbrush',
  templateUrl: './paintbrush.component.html',
  styleUrls: ['./paintbrush.component.scss'],
})
export class PaintbrushComponent extends StrokeAbstract implements OnInit, OnDestroy {

  constructor(saveRef: SaveService,
    attributeServiceRef: AttributesService,
    colourServiceRef: ColourService) {
    super(saveRef, attributeServiceRef, colourServiceRef);
    this.stroke.id = ToolConstants.TOOL_ID.PAINTBRUSH;
  }

  saveAttribute(): void {
    this.attributesService.paintbrushAttributes.wasSaved = true;
    this.attributesService.paintbrushAttributes.savedStrokeWidth = this.stroke.strokeWidth;
    this.attributesService.paintbrushAttributes.savedFilter = this.stroke.filter;
  }

  ngOnInit(): void {
    if (this.attributesService.paintbrushAttributes.wasSaved) {
      this.stroke.strokeWidth = this.attributesService.paintbrushAttributes.savedStrokeWidth;
      this.stroke.filter = this.attributesService.paintbrushAttributes.savedFilter;
    }
    this.colourService.data.subscribe((colour: string[]) => {
      this.stroke.colour = colour[0];
    });
  }

  ngOnDestroy(): void {
    this.saveAttribute();
  }

  setFilter(filter: number): void {
    switch (filter) {
      case FilterSelection.FILTER0:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER0;
        break;
      case FilterSelection.FILTER1:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER1;
        break;
      case FilterSelection.FILTER2:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER2;
        break;
      case FilterSelection.FILTER3:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER3;
        break;
      case FilterSelection.FILTER4:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER4;
        break;
      case FilterSelection.FILTER5:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER5;
        break;
      default:
        this.stroke.filter = ToolConstants.FILTER_ID.FILTER0;
        break;
    }
  }

}
