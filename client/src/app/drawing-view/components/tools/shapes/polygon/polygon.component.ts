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
  }

  // Abstract&Overridden methods

  ngOnInit(): void {
    if (this.attributesService.rectangleAttributes.wasSaved) {
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
    super.calculateDimensions(); // some usless math for polygon, optimizable in the future?
    
    
  }

  increaseVertexNumber(): void {
    if(this.shape.verticesNumber != undefined && this.shape.verticesNumber != 12){ // constante max vertice number
      this.shape.verticesNumber++;
    }
  }

  decreaseVertexNumber(): void {
    if(this.shape.verticesNumber != undefined && this.shape.verticesNumber != 0){
      this.shape.verticesNumber--;
    }
  }

}
