import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ExportInformationService } from 'src/app/services/export-information/export-information.service';
import { ExportAs, Strings } from 'src/AppConstants/Strings';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';

@Component({
  selector: 'app-export-window',
  templateUrl: './export-window.component.html',
  styleUrls: ['./export-window.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ExportWindowComponent extends ModalWindowComponent implements OnInit {

  formatSelected: boolean;
  protected exportType: ExportAs;
  format: string;
  width: number;
  height: number;
  myCanvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;



  constructor(dialogRef: MatDialogRef<ExportWindowComponent>,
    public exportInformation: ExportInformationService, public cavasData: CanvasInformationService) {
    super(dialogRef, {});
    this.data.title = Strings.EXPORT_WINDOW_TITLE;
    this.formatSelected = false;
    if(this.canvasData){
      this.width = this.canvasData.data.drawingWidth;
      this.height = this.canvasData.data.drawingHeight;
    }
    this.myCanvas = document.createElement('canvas');
    this.myCanvas.width = this.width;
    this.myCanvas.height = this.height;
  }

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
  }

  ngOnInit(): void {
    this.format = 'Exporter au format';
  }

  // cloudconvert api

  onAcceptClick(name: string): void {
    switch (this.exportType) {
      case ExportAs.PNG:
        if (this.exportInformation.data.canvasElement.nativeElement) {
          const data = this.xmlToBase64();
          this.drawImage(data);
        }
        this.onClose();
        break;
      case ExportAs.SVG:
        if (this.exportInformation.data.canvasElement.nativeElement) {
          const data = (new XMLSerializer())
            .serializeToString(this.exportInformation.data.canvasElement.nativeElement);
          const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
          this.download(name + '.svg', blob);
        }
        this.onClose();
        break;
      case ExportAs.JPG:
        if (this.exportInformation.data.canvasElement.nativeElement) {
          const data = this.xmlToBase64();
          this.drawImage(data);
        }
        this.onClose();
        break;
      case ExportAs.BMP:
        if (this.exportInformation.data.canvasElement.nativeElement) {
          const data = this.xmlToBase64();
          this.drawImage(data);
        }
        this.onClose();
        break;
    }
  }

  xmlToBase64(): string {
    this.ctx = this.myCanvas.getContext('2d');
    let img = new Image();
    img.width = this.width;
    img.height = this.height;
    const data = (new XMLSerializer()).serializeToString(this.exportInformation.data.canvasElement.nativeElement);
    return 'data:image/svg+xml;base64,' + window.btoa(data);
  }

  drawImage(data: string) {
    let img = new Image();
    img.width = this.width;
    img.height = this.height;
    img.onload = () => {
      if(this.ctx){
        this.ctx.drawImage(img, 0, 0);
        const a = document.createElement('a');
        a.download = name + '.' + this.exportType;
        a.href = this.myCanvas.toDataURL('image/' + this.exportType, 1.0);
        a.click();
      }
    };
    img.src = data;
  }

  download(filename: string, blob: Blob) {
    const elem = document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
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
    switch (type) {
      case ExportAs.BMP: this.exportType = type;
        break;
      case ExportAs.JPG: this.exportType = type;
        break;
      case ExportAs.PNG: this.exportType = type;
        break;
      case ExportAs.SVG: this.exportType = type;
        break;

    }
  }

}
