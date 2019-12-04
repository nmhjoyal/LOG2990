import { Injectable } from '@angular/core';
import { Id, ToolConstants } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { CanvasInformationService } from '../canvas-information/canvas-information.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { SelectorService } from '../selector-service/selector-service';
import ParserHelper from '../parser-service/parser.service';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService {

  undoList: ITools[];
  accessingUndoList: boolean;
  private isUndoing: boolean;

  constructor(public drawingStorage: DrawingStorageService, public canvasInformation: CanvasInformationService,
    private selectorService: SelectorService) {
    this.undoList = [];
    this.accessingUndoList = false;
    this.isUndoing = false;
   }

  undo(): ITools|undefined {
    this.accessingUndoList = true;
    this.isUndoing = true;
    const poppedObject = this.drawingStorage.drawings.pop();
    if ( poppedObject ) {
      this.parseHandlers(poppedObject);
      this.undoList.push(poppedObject);
    }
    return poppedObject;
  }

  redo(): ITools|undefined {
    this.isUndoing = false;
    const poppedObject = this.undoList.pop();
    if (poppedObject) {
      this.parseHandlers(poppedObject);
      this.drawingStorage.saveDrawing(poppedObject);
    }
    return poppedObject;
  }

  parseHandlers(operation: ITools): void {
    switch (operation.id) {
      case Id.ERASER:
        this.handleEraserOperation(operation, this.isUndoing);
        break;

      case Id.PRIMARY_COLOUR_CHANGE:
        this.handlePrimaryColourApplication(operation, this.isUndoing);
        break;

      case Id.SECONDARY_COLOUR_CHANGE:
        this.handleSecondaryColourApplication(operation, this.isUndoing);
        break;

      case Id.DRAG:
      this.handleDrag(operation, this.isUndoing);
      break;


      default:
        break;
    }
  }

  handleEraserOperation( operation: ITools, isUndo: boolean ): void {
    if ( operation.objects ) {
      if (!isUndo) {
        operation.objects.forEach((element) => {
          const index = this.drawingStorage.drawings.indexOf(element);
          this.drawingStorage.drawings.splice(index, 1);
        });
      } else if (operation.indexes) {
        for (let index = operation.objects.length - 1; index >= 0; index--) {
          const drawing = operation.objects[index];
          this.drawingStorage.drawings.splice(operation.indexes[index], 0, drawing);
        }
      }
    }
  }

  handlePrimaryColourApplication( operation: ITools, isUndo: boolean ) {
    const colourToApply: string|undefined = isUndo ?  operation.initialColour : operation.appliedColour;
    if ( operation.indexes && colourToApply !== undefined) {
      if ( operation.indexes[0] === ToolConstants.NULL ) {
          this.canvasInformation.data.drawingColour = colourToApply;
        } else {
          'primaryColour' in this.drawingStorage.drawings[operation.indexes[0]] ?
          this.drawingStorage.drawings[operation.indexes[0]].primaryColour =  colourToApply :
          this.drawingStorage.drawings[operation.indexes[0]].colour = colourToApply;
      }
    }
  }

  handleSecondaryColourApplication( operation: ITools, isUndo: boolean ): void {
    if ( operation.indexes ) {
    const colourToApply: string|undefined = isUndo ? operation.initialColour : operation.appliedColour;
    this.drawingStorage.drawings[operation.indexes[0]].secondaryColour = colourToApply;
    }
  }

  handleDrag(operation: ITools, isUndo: boolean): void {
    // All drag interfaces have an initialized offsetX and offsetY and an index array
    // tslint:disable: no-non-null-assertion
    
    const xModificator = isUndo? operation.offsetX! : -operation.offsetX!;
    const yModificator = isUndo? operation.offsetY! : -operation.offsetY!;
    let affectedDrawing;
    operation.indexes!.forEach((index) => {
      // tslint:enable: no-non-null-assertion
      affectedDrawing = this.drawingStorage.drawings[index];
      switch (affectedDrawing.id) {

        case Id.LINE: case Id.CRAYON: case Id.PAINTBRUSH: case Id.PEN: case Id.POLYGON: case Id.QUILL:
          let xDestination = affectedDrawing.x + affectedDrawing.width / 2 - xModificator;
          let yDestination = affectedDrawing.y + affectedDrawing.height / 2 - yModificator;
          ParserHelper.dragPolylinePoints(xDestination, yDestination, affectedDrawing,
             this.selectorService );
          break;
        
        case Id.STAMP: case Id.RECTANGLE: case Id.ELLIPSE: case Id.TEXT: case Id.SPRAY_CAN:
          affectedDrawing.x -= xModificator;
          affectedDrawing.alignX = affectedDrawing.alignX ? affectedDrawing.x : affectedDrawing.alignX;
          affectedDrawing.y -= yModificator;
          if ( affectedDrawing.sprays ) {
            affectedDrawing.sprays.forEach(spray => {
              spray.cx -= xModificator;
              spray.cy -= yModificator;
            });
          }
          break;

        default:
          break;
      }
      
    });
  }

}
