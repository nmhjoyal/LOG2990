import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ShapeAbstract } from '../../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/tool-constants';

@Component({
  selector: 'app-tools-polygon',
  templateUrl: './polygon.component.html',
  styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent extends ShapeAbstract implements OnInit, OnDestroy {

  constructor(toolServiceRef: ToolHandlerService, attributesServiceRef: AttributesService, colorServiceRef: ColorService) {
    super(toolServiceRef, attributesServiceRef, colorServiceRef);
    this.shape.id = ToolConstants.TOOL_ID.POLYGON;
    this.shape.verticesNumber = ToolConstants.MIN_VERTEX_NUMBER;
  }

  // Abstract&Overridden methods

  ngOnInit(): void {
    if (this.attributesService.polygonAttributes.wasSaved) {
      this.shape.strokeWidth = this.attributesService.polygonAttributes.savedStrokeWidth;
      this.traceMode = this.attributesService.polygonAttributes.savedTraceMode;
      this.shape.verticesNumber = this.attributesService.polygonAttributes.savedVerticesNumber;
    }
    this.setTraceMode(this.traceMode);
  }

  ngOnDestroy(): void {
    this.attributesService.polygonAttributes.savedTraceMode = this.traceMode;
    this.attributesService.polygonAttributes.savedStrokeWidth = this.shape.strokeWidth;
    this.attributesService.polygonAttributes.savedVerticesNumber = this.shape.verticesNumber;
    this.attributesService.polygonAttributes.wasSaved = true;
  }

  protected calculateDimensions(): void {
    super.calculateDimensions();

    // tslint:disable:no-magic-numbers
    this.shape.x = this.previewBox.x + this.previewBox.width / 2;  // x coordinate for center
    this.shape.y = this.previewBox.y + this.previewBox.height / 2; // y coordinate for center

    const imaginaryCircleRadius = (Math.min(this.previewBox.width, this.previewBox.height) / 2) - this.shape.strokeWidth;
    // tslint:enable:no-magic-numbers
    this.shape.height = imaginaryCircleRadius; 
    this.shape.width = imaginaryCircleRadius;
    
    this.shape.vertices = '';
    if(this.shape.verticesNumber != undefined && (imaginaryCircleRadius - this.shape.strokeWidth) > 0) {
      // tslint:disable-next-line:no-magic-numbers
      const angleBetweenVertices: number = 2*Math.PI / this.shape.verticesNumber;
      let angleTracker: number = 0;
      let bufferX: number = 0;
      let bufferY: number = 0;
      for (let index = 0; index < this.shape.verticesNumber; index++) {
        angleTracker += angleBetweenVertices;
        bufferX = this.shape.x + (imaginaryCircleRadius * Math.cos(angleTracker));
        bufferY = this.shape.y + (imaginaryCircleRadius * Math.sin(angleTracker));
        this.shape.vertices += (bufferX.toFixed(0) + ',' + bufferY.toFixed(0) + ' ');
      }
    }

  }

  protected saveShape(): void {
    if(this.shape.vertices !== ''){
      super.saveShape();
    }
  }

  increaseVertexNumber(): void {
    if(this.shape.verticesNumber != undefined && this.shape.verticesNumber != ToolConstants.MAX_VERTEX_NUMBER){
      this.shape.verticesNumber++;
    }
  }

  decreaseVertexNumber(): void {
    if(this.shape.verticesNumber != undefined && this.shape.verticesNumber != ToolConstants.MIN_VERTEX_NUMBER){
      this.shape.verticesNumber--;
    }
  }

}
