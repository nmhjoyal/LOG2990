import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectorService } from 'src/app/services/selector-service/selector-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
/*import { ClickTypes } from 'src/AppConstants/ClickTypes';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { ShapeAbstract } from '../assets/abstracts/shape-abstract/shape-abstract';
import { AttributesService } from '../assets/attributes/attributes.service';*/
import { ITools } from '../assets/interfaces/itools';

@Component({
  selector: 'app-tools-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.scss'],
})

export class ClipboardComponent implements OnInit, OnDestroy {

    clipboard: Set<ITools>;
    transforms: SVGGraphicsElement;

    constructor(protected toolService: ToolHandlerService, protected selectorService: SelectorService) {
      }

    ngOnInit(): void {
        // empty block
    }

    ngOnDestroy(): void {
        // empty block
    }

    copy(): void {
        this.clipboard.clear();
        if (this.selectorService.selectedObjects) {
            this.selectorService.selectedObjects.forEach((selectedObject) => {
              this.clipboard.add(selectedObject);
          });
        }
      }

    paste(cursorX: number, cursorY: number): void {
        if (this.clipboard.size) {
            const selection: Set<ITools> = this.clipboard;
            selection.forEach((copiedObject) => {
            this.toolService.drawings.push(copiedObject);
            /*copiedObject.transform.baseval();
            let trans = this.transforms.transform.baseVal;*/
            const pl = this.transforms.transform.baseVal;
            pl;
            copiedObject.x = cursorX;
            copiedObject.y = cursorY;
            if (copiedObject.points) {
                copiedObject.points;
            }
            this.toolService.drawings.push(copiedObject);
            });
        }
    }

    cut(): void {
    this.copy();
    this.delete();
    }

    duplicate(): void {
    const selection: Set<ITools> = this.selectorService.selectedObjects;
    selection.forEach((selectedObject) => {
        this.toolService.drawings.push(selectedObject);
    });
    selection.forEach((selectedObject) => {
        const copiedObject: ITools = selectedObject;
        this.toolService.drawings.push(selectedObject);
        if (copiedObject.x + copiedObject.width > window.innerWidth) {
        copiedObject.x -= 100;
        copiedObject.y -= 100;
        } else if (copiedObject.y + copiedObject.height > window.innerHeight) {
        copiedObject.x -= 100;
        copiedObject.y -= 100;
        } else {
        copiedObject.x += NumericalValues.DUPLICATE_OFFSET;
        copiedObject.y += NumericalValues.DUPLICATE_OFFSET;
        }
        this.selectorService.selectedObjects.add(selectedObject);
        this.toolService.drawings.push(copiedObject);
    });
    }
      delete(): void {
        this.selectorService.selectedObjects.forEach((element) => {
          const index = this.toolService.drawings.indexOf(element);
          if (index !== -1) {
            this.toolService.drawings.splice(index, 1);
           }
        });
        this.selectorService.resetSelectorService();
        this.selectorService.selectedObjects.clear();
      }

}
