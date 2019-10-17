import { Component, OnDestroy, OnInit} from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { DrawingToolsAbstract } from '../../assets/drawing-tools-abstract';
import { ToolConstants } from '../../assets/tool-constants';
import { AttributesService } from '../../assets/attributes/attributes.service';

@Component({
  selector: 'app-crayon',
  templateUrl: './crayon.component.html',
  styleUrls: ['./crayon.component.scss'],
})

export class CrayonComponent extends DrawingToolsAbstract implements OnInit, OnDestroy {

  constructor(toolServiceRef: ToolHandlerService, attributesServiceRef: AttributesService) {
    super(toolServiceRef, attributesServiceRef);
    this.stroke.id = ToolConstants.TOOL_ID.CRAYON;
  }

  ngOnInit(): void {
    if(this.attributesService.crayonAttributes.wasSaved) {
      this.stroke.strokeWidth = this.attributesService.crayonAttributes.savedStrokeWidth;
    }
  }

  ngOnDestroy() {
    this.attributesService.crayonAttributes.savedStrokeWidth = this.stroke.strokeWidth;
  }
  
}
