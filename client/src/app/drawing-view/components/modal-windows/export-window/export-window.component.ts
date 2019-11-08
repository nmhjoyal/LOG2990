import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ExportInformationService } from 'src/app/services/export-information/export-information.service';
import { ExportAs, Strings } from 'src/AppConstants/Strings';
import { ISVGPreview } from '../../../../../../../common/drawing-information/ISVGPreview';
import { ModalWindowComponent } from '../modal-window/modal-window.component';

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

  constructor(dialogRef: MatDialogRef<ExportWindowComponent>,
    public exportInformation: ExportInformationService) {
    super(dialogRef, {});
    this.data.title = Strings.EXPORT_WINDOW_TITLE;
    this.formatSelected = false;
  }

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
  }

  ngOnInit(): void {
    this.format = 'Exporter au format';
  }

  onAcceptClick(name: string): void {
    switch (this.exportType) {
      case ExportAs.PNG:
        if (this.exportInformation.data.canvasElement.nativeElement) {
          const data = (new XMLSerializer())
            .serializeToString(this.exportInformation.data.canvasElement.nativeElement);
          const blob = new Blob([data], { type: 'image/png+xml;charset=utf-8' });

          this.download(name + '.png', blob);
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
          const data
            = (new XMLSerializer()).serializeToString(this.exportInformation.data.canvasElement.nativeElement);
          const blob = new Blob([data], { type: 'image/jpeg' });
          this.download(name + '.jpeg', blob);
        }
        this.onClose();
        break;
      case ExportAs.BMP:
        if (this.exportInformation.data.canvasElement.nativeElement) {
          const data
            = (new XMLSerializer()).serializeToString(this.exportInformation.data.canvasElement.nativeElement);
          const blob
            = new Blob([data], { type: 'image/bmp+xml;charset=utf-8' });
          this.download(name + '.bmp', blob);
        }
        this.onClose();
        break;
    }
  }

  download(filename: string, blob: Blob) {
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
