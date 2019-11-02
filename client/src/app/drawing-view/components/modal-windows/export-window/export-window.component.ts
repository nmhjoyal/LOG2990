import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { IndexService } from 'src/app/services/index/index.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Strings, ExportAs } from 'src/AppConstants/Strings';
import { ISVGPreview } from '../../../../../../../common/drawing-information/ISVGPreview';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { ISaveModalData } from '../save-window/ISaveModalData';
import * as svg from 'save-svg-as-png';


@Component({
  selector: 'app-export-window',
  templateUrl: './export-window.component.html',
  styleUrls: ['./export-window.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ExportWindowComponent extends ModalWindowComponent implements OnInit {

  protected preview: ISVGPreview;
  formatSelected: boolean;
  protected exportType: ExportAs;
  format: string;

  constructor(dialogRef: MatDialogRef<ExportWindowComponent>, @Inject(MAT_DIALOG_DATA) public data: ISaveModalData,
    protected canvasData: CanvasInformationService, protected toolHandler: ToolHandlerService, protected index: IndexService) {
    super(dialogRef, data, canvasData, undefined, toolHandler, index);
    this.data.title = Strings.EXPORT_WINDOW_TITLE;
    this.formatSelected = false;
  }

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
  }

  ngOnInit(): void {
    this.format = "Exporter au format"
  }

  onAcceptClick(name:string): void {
    switch(this.exportType){
      case ExportAs.PNG:
        svg.saveSvgAsPng(document.getElementById('canvas'), name + '.png');
        this.onClose();
        break;
      case ExportAs.SVG:
        var canvas = document.getElementById('canvas');
        if(canvas != null){
          var data = (new XMLSerializer()).serializeToString(canvas);
          var blob = new Blob([data], {type:"image/svg+xml;charset=utf-8"});
          this.download(name+'.svg', blob);
        } 
        this.onClose();
        break;
      case ExportAs.JPG:
        this.onClose();
        break;
      case ExportAs.BMP:
        this.onClose();
        break;
    }
  }

  download(filename: string, blob:Blob){ 
      const elem = document.createElement('a');
      elem.href = URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  chooseExportType(type: string): void {
    this.formatSelected = true;
    this.format = type;
    switch(type){
      case ExportAs.BMP: this.exportType = type;
      case ExportAs.JPG: this.exportType = type;
      case ExportAs.PNG: this.exportType = type;
      case ExportAs.SVG: this.exportType = type;
    }
  }
  

}
