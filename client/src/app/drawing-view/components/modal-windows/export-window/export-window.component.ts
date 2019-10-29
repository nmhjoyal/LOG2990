import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { IndexService } from 'src/app/services/index/index.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Strings, SaveAs } from 'src/AppConstants/Strings';
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

  protected name: string;
  protected preview: ISVGPreview;
  isFinishedSaving: boolean;
  protected exportType: SaveAs;
  format: string;

  constructor(dialogRef: MatDialogRef<ExportWindowComponent>, @Inject(MAT_DIALOG_DATA) public data: ISaveModalData,
    protected canvasData: CanvasInformationService, protected toolHandler: ToolHandlerService, protected index: IndexService) {
    super(dialogRef, data, canvasData, undefined, toolHandler, index);
    this.data.title = Strings.EXPORT_WINDOW_TITLE;
    this.isFinishedSaving = true;
  }

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
  }

  ngOnInit(): void {
    this.format = "Exporter au format"
  }

  onAcceptClick(): void {
    this.isFinishedSaving = false;
    svg.saveSvgAsPng(document.getElementById('canvas'), name + '.png');
    this.onClose();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  chooseExportType(n: number): void {
      this.exportType = n;
      this.format = "PNG";
  }
  

}
