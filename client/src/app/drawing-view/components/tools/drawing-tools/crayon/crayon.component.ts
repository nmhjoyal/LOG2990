import { Component, OnDestroy, OnInit} from '@angular/core';
import { ColourService } from 'src/app/services/colour_service/colour.service';
import { SaveService } from 'src/app/services/save-service/save.service';
import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';

@Component({
  selector: 'app-crayon',
  templateUrl: './crayon.component.html',
  styleUrls: ['./crayon.component.scss'],
})

export class CrayonComponent extends StrokeAbstract implements OnInit, OnDestroy {

  constructor(saveRef: SaveService,
              attributesServiceRef: AttributesService,
              colourServiceRef: ColourService) {
    super(saveRef, attributesServiceRef, colourServiceRef);
    this.stroke.id = ToolConstants.TOOL_ID.CRAYON;
  }

  saveAttribute(): void {
    this.attributesService.crayonAttributes.wasSaved = true;
    this.attributesService.crayonAttributes.savedStrokeWidth = this.stroke.strokeWidth;
  }
  ngOnInit(): void {
    if (this.attributesService.crayonAttributes.wasSaved) {
      this.stroke.strokeWidth = this.attributesService.crayonAttributes.savedStrokeWidth;
    }
  }

  ngOnDestroy() {
    this.saveAttribute();
  }

}
