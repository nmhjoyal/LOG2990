import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color_service/color.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { ShapeAbstract } from '../../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../../assets/attributes/attributes.service';
import { ToolConstants } from '../../assets/constants/tool-constants';

@Component({
  selector: 'app-tools-polygon',
  templateUrl: './polygon.component.html',
  styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent extends ShapeAbstract implements OnInit, OnDestroy {

  constructor(drawingStorageRef: DrawingStorageService, attributesServiceRef: AttributesService, colorServiceRef: ColorService) {
    super(drawingStorageRef, attributesServiceRef, colorServiceRef);
    this.shape.id = ToolConstants.TOOL_ID.POLYGON;
    this.shape.verticesNumber = ToolConstants.MIN_VERTEX_NUMBER;
  }

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
    // tslint:disable:no-magic-number
    this.shape.x = this.previewBox.x + this.previewBox.width / 2;  // x coordinate for center
    this.shape.y = this.previewBox.y + this.previewBox.height / 2; // y coordinate for center
    // tslint:enable:no-magic-number

    const imaginaryCircleRadius = (Math.min(this.previewBox.width, this.previewBox.height) / 2) - this.shape.strokeWidth;
    this.shape.height = imaginaryCircleRadius;
    this.shape.width = imaginaryCircleRadius;

    this.shape.vertices = '';
    if (this.shape.verticesNumber !== undefined && (imaginaryCircleRadius - this.shape.strokeWidth) > 0) {
      // tslint:disable:no-magic-number
      const angleBetweenVertices: number = 2 * Math.PI / this.shape.verticesNumber;
      let angleTracker = Math.PI / 2 - Math.PI / this.shape.verticesNumber;
      // tslint:enable:no-magic-number
      let bufferX = 0;
      let bufferY = 0;
      for (let index = 0; index < this.shape.verticesNumber; index++) {
        angleTracker += angleBetweenVertices;
        bufferX = this.shape.x + (imaginaryCircleRadius * Math.cos(angleTracker));
        bufferY = this.shape.y + (imaginaryCircleRadius * Math.sin(angleTracker));
        this.shape.vertices += (bufferX.toFixed(0) + ',' + bufferY.toFixed(0) + ' ');

      }
    }

  }

  protected saveShape(): void {
    if (this.shape.vertices !== '') {
      super.saveShape();
    }
  }

  increaseVertexNumber(): void {
    if (this.shape.verticesNumber !== undefined && this.shape.verticesNumber !== ToolConstants.MAX_VERTEX_NUMBER) {
      this.shape.verticesNumber++;
    }
  }

  decreaseVertexNumber(): void {
    if (this.shape.verticesNumber !== undefined && this.shape.verticesNumber !== ToolConstants.MIN_VERTEX_NUMBER) {
      this.shape.verticesNumber--;
    }
  }

}
