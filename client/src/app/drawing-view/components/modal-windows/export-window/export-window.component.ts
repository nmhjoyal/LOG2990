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

  protected formatSelected: boolean;
  protected exportTypeEnum = ExportAs;
  protected exportType: string;
  protected format: string;
  private width: number;
  private height: number;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  protected name: string;

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
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
  }

  ngOnInit(): void {
    this.format = Strings.EXPORT_TO_FORMAT;
  }

  onAcceptClick(): void {
    switch (this.exportType) {
      case ExportAs.PNG:
        const dataPNG = this.xmlToBase64();
        this.drawImage(dataPNG);
        this.onClose();
        break;
      case ExportAs.SVG:
        const dataSVG = (new XMLSerializer())
          .serializeToString(this.exportInformation.data.canvasElement.nativeElement as Node);
        const blob = new Blob([dataSVG], { type: 'image/svg+xml;charset=utf-8' });
        this.download(this.name + '.svg', blob);
        this.onClose();
        break;
      case ExportAs.JPG:
        const dataJPG = this.xmlToBase64();
        this.drawImage(dataJPG);
        this.onClose();
        break;
      case ExportAs.BMP:
        const dataBMP = this.xmlToBase64();
        this.drawImage(dataBMP);
        this.onClose();
        break;
    }
  }

  xmlToBase64(): string {
    this.context = this.canvas.getContext('2d');
    const img = new Image();
    img.width = this.width;
    img.height = this.height;
    const data = (new XMLSerializer()).serializeToString(this.exportInformation.data.canvasElement.nativeElement as Node);
    return 'data:image/svg+xml;base64,' + window.btoa(data);
  }

  drawImage(data: string): void {
    const img = new Image();
    img.width = this.width;
    img.height = this.height;
    img.src = data;
    img.addEventListener('load', () => {
      if (this.context) {
        this.context.drawImage(img, 0, 0);
        const a = document.createElement('a');
        a.download = this.name + '.' + this.exportType;
        if (this.exportType === this.exportTypeEnum.JPG || this.exportType === this.exportTypeEnum.PNG) {
          a.href = this.canvas.toDataURL('image/' + this.exportType, 1.0);
        } else if (this.exportType === this.exportTypeEnum.BMP) {
          const bmpUrlProvider = new CanvasToBMP();
          a.href = bmpUrlProvider.toDataURL(this.canvas);
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
