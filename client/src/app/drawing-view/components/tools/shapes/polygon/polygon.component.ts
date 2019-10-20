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

  protected vertices: string;

  constructor(toolServiceRef: ToolHandlerService, attributesServiceRef: AttributesService, colorServiceRef: ColorService) {
    super(toolServiceRef, attributesServiceRef, colorServiceRef);
    this.shape.id = ToolConstants.TOOL_ID.POLYGON;
    this.shape.verticesNumber = 3; // constante min vertex number
    this.vertices = "";
  }

  // Abstract&Overridden methods
  onMouseUp() {
    super.onMouseUp();
    console.log(this.vertices);
  }

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
    const minValue = Math.min(this.previewBox.width, this.previewBox.height);
    // tslint:disable:no-magic-numbers
    this.shape.height = minValue / 2; // radius of the circle from which the polygon is constructed
    this.shape.width = minValue / 2;
    // tslint:enable:no-magic-numbers
    this.shape.x = this.previewBox.x + this.shape.width;  // x coordinate for center
    this.shape.y = this.previewBox.y + this.shape.height; // y coordinate for center

    if(this.shape.verticesNumber != undefined) {
      const angleBetweenVertices: number = Math.PI / this.shape.verticesNumber;
      let angleTracker: number = 0;
      let bufferX: number = 0;
      let bufferY: number = 0;
      for (let index = 0; index < this.shape.verticesNumber; index++) {
        angleTracker += angleBetweenVertices;
        bufferX = this.shape.x + Math.cos(angleTracker);
        bufferY = this.shape.y + Math.sin(angleTracker);
        this.vertices.concat( bufferX.toString() + "," + bufferY.toString() + " ");
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
