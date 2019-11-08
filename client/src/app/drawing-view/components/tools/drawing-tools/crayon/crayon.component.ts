import { Component, OnDestroy, OnInit} from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';
import { SaveService } from 'src/app/services/save-service/save.service';

@Component({
  selector: 'app-crayon',
  templateUrl: './crayon.component.html',
  styleUrls: ['./crayon.component.scss'],
})

export class CrayonComponent extends StrokeAbstract implements OnInit, OnDestroy {

  constructor(saveRef: SaveService,
              attributesServiceRef: AttributesService,
              colorServiceRef: ColorService) {
    super(saveRef, attributesServiceRef, colorServiceRef);
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
