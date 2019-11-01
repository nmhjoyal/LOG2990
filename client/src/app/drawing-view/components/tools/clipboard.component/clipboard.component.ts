import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectorService } from 'src/app/services/selector-service/selector-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
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

    clipboard: ITools[];
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
        if (this.selectorService.SelectedObjects) {
            this.selectorService.SelectedObjects.forEach((selectedObject) => {
                this.clipboard.push(selectedObject);
            });
        }
    }

    paste(): void {
        if (this.clipboard) {
            this.clipboard.forEach((copieddObject) => {
                this.toolService.drawings.push(copieddObject);
            });
        }
    }

    cut(): void {
        this.copy();
        this.toolService.drawings.pop();
    }

    duplicate(): void {
        this.copy();
        this.paste();
    }

}
