import { Component, OnInit } from '@angular/core';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ShapeAbstract } from '../../assets/shape-abstract';
import { ToolConstants } from '../../assets/tool-constants';

@Component({
  selector: 'app-tools-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent extends ShapeAbstract implements OnInit {

  constructor(serviceRef: ToolHandlerService) {
    super(serviceRef);
    this.shape.id = ToolConstants.TOOL_ID.RECTANGLE;
  }

  ngOnInit() {
    // empty init
  }

  // Abstract&Overridden methods

  protected calculateDimensions(): void {
    super.calculateDimensions();
    if (this.shiftDown ) { // Carré maximale Non centré...
      const minValue = Math.min(this.shape.height, this.shape.width);
      this.shape.height = minValue;
      this.shape.width = minValue;
      // Centrage du carré... necessaire?
      this.shape.x += this.previewBox.width / 2 - this.shape.width / 2 - this.shape.strokeWidth / 2;
      this.shape.y += this.previewBox.height / 2 - this.shape.height / 2 - this.shape.strokeWidth / 2;
    }
  }
}
