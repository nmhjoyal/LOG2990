import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ShapeAbstract } from '../../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/tool-constants';

// interface IVertex {
//   x: number,
//   y: number,
// };

@Component({
  selector: 'app-tools-polygon',
  templateUrl: './polygon.component.html',
  styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent extends ShapeAbstract implements OnInit, OnDestroy {

  constructor(toolServiceRef: ToolHandlerService, attributesServiceRef: AttributesService, colorServiceRef: ColorService) {
    super(toolServiceRef, attributesServiceRef, colorServiceRef);
    this.shape.id = ToolConstants.TOOL_ID.POLYGON;
    this.shape.verticesNumber = 3; // constante min vertex number
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

    const radius = Math.min(this.previewBox.width, this.previewBox.height);
    
    this.shape.height = radius; // radius of the circle from which the polygon is constructed
    this.shape.width = radius;
    // tslint:enable:no-magic-numbers

    if(this.shape.verticesNumber != undefined) {
      // tslint:disable-next-line:no-magic-numbers
      const angleBetweenVertices: number = 2*Math.PI / this.shape.verticesNumber;
      let angleTracker: number = - angleBetweenVertices / 2;
      let bufferX: number = 0;
      let bufferY: number = 0;
      this.shape.vertices = '';
      for (let index = 0; index < this.shape.verticesNumber; index++) {
        angleTracker += angleBetweenVertices;
        // tslint:disable:no-magic-numbers
        bufferX = this.shape.x + (radius * Math.cos(angleTracker));
        bufferY = this.shape.y + (radius * Math.sin(angleTracker));
        // tslint:enable:no-magic-numbers
        this.shape.vertices += (bufferX.toFixed(0) + ',' + bufferY.toFixed(0) + ' ');
      }
    }

  }

  increaseVertexNumber(): void {
    if(this.shape.verticesNumber != undefined && this.shape.verticesNumber != 12){ // constante max vertice number
      this.shape.verticesNumber++;
    }
  }

  decreaseVertexNumber(): void {
    if(this.shape.verticesNumber != undefined && this.shape.verticesNumber != 3){ // constante min vertex number
      this.shape.verticesNumber--;
    }
  }

}
