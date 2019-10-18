import { Component, OnDestroy, OnInit} from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ToolConstants } from '../../assets/tool-constants';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { StrokeAbstract } from '../../assets/abstracts/stroke-abstract/stroke-abstract';

@Component({
  selector: 'app-crayon',
  templateUrl: './crayon.component.html',
  styleUrls: ['./crayon.component.scss'],
})

export class CrayonComponent extends StrokeAbstract implements OnInit, OnDestroy {

  constructor(toolServiceRef: ToolHandlerService, attributesServiceRef: AttributesService) {
    super(toolServiceRef, attributesServiceRef);
    this.stroke.id = ToolConstants.TOOL_ID.CRAYON;
  }

  saveAttribute(): void{
    this.attributesService.crayonAttributes.savedStrokeWidth = this.stroke.strokeWidth;
  }
  ngOnInit(): void {
    if(this.attributesService.crayonAttributes.wasSaved) {
      this.stroke.strokeWidth = this.attributesService.crayonAttributes.savedStrokeWidth;
    }
  }

  ngOnDestroy() {
    this.saveAttribute();
  }

  
}
