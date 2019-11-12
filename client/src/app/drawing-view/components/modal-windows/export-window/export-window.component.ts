import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ExportInformationService } from 'src/app/services/export-information/export-information.service';
import { ExportAs, Strings } from 'src/AppConstants/Strings';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { CanvasToBMP } from './canvas-to-bmp';

@Component({
  selector: 'app-export-window',
  templateUrl: './export-window.component.html',
  styleUrls: ['./export-window.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ExportWindowComponent extends ModalWindowComponent implements OnInit {

  formatSelected: boolean;
  exportTypeEnum = ExportAs;
  protected exportType: string;
  format: string;
  width: number;
  height: number;
  myCanvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  name: string;

  constructor(dialogRef: MatDialogRef<ExportWindowComponent>,
    public exportInformation: ExportInformationService, public canvasData: CanvasInformationService) {
    super(dialogRef, {});
    this.exportType = '';
    this.data.title = Strings.EXPORT_WINDOW_TITLE;
    this.formatSelected = false;
    if (this.canvasData) {
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

  onAcceptClick(): void {
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
          this.download(this.name + '.svg', blob);
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
    const img = new Image();
    img.width = this.width;
    img.height = this.height;
    const data = (new XMLSerializer()).serializeToString(this.exportInformation.data.canvasElement.nativeElement);
    return 'data:image/svg+xml;base64,' + window.btoa(data);
  }

  drawImage(data: string): void {
    const img = new Image();
    img.width = this.width;
    img.height = this.height;
    img.src = data;
    img.addEventListener('load', () => {
      if (this.ctx) {
        this.ctx.drawImage(img, 0, 0);
        const a = document.createElement('a');
        a.download = this.name + '.' + this.exportType;
        if (this.exportType === this.exportTypeEnum.JPG || this.exportType === this.exportTypeEnum.PNG) {
          a.href = this.myCanvas.toDataURL('image/' + this.exportType, 1.0);
        } else if (this.exportType === this.exportTypeEnum.BMP) {
            const bmpUrlProvider = new CanvasToBMP();
            a.href = bmpUrlProvider.toDataURL(this.myCanvas);
          }
        a.click();
      }
    });
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
