import { Component, HostListener, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Strings, ExportAs } from 'src/AppConstants/Strings';
import { ISVGPreview } from '../../../../../../../common/drawing-information/ISVGPreview';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { IExportData } from './IExportData';


@Component({
  selector: 'app-export-window',
  templateUrl: './export-window.component.html',
  styleUrls: ['./export-window.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ExportWindowComponent extends ModalWindowComponent implements OnInit {

  protected preview: ISVGPreview;
  formatSelected: boolean;
  exportType: ExportAs;
  format: string;


  constructor(dialogRef: MatDialogRef<ExportWindowComponent>, @Inject(MAT_DIALOG_DATA) public data: IExportData) {
    super(dialogRef, data);
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
    // var canvas = this.data.canvasElement.nativeElement.innerHTML
    var canvas = document.getElementById('canvas');
      var img = new Image;
      img.src = name+'.svg'
      switch(this.exportType){
        case ExportAs.PNG:
          
            /*
            var data = (new XMLSerializer()).serializeToString(canvas);
            var blob = new Blob([data], {type:"image/svg+xml;charset=utf-8"});
            this.download(name+'.png', blob);
            */
            img.onload = function() {
              if(canvas !== null && ctx !== null){
              ctx.drawImage(img, 0, 0);
              var a = document.createElement("a");
              a.download = name+'.png';
              a.href = canvas.toDataURL("image/png");
              a.click();
              };
            }
          this.onClose();
          break;
        case ExportAs.SVG:
          if(canvas){
            var data = (new XMLSerializer()).serializeToString(canvas);
            var blob = new Blob([data], {type:"image/svg+xml;charset=utf-8"});
            this.download(name+'.svg', blob);
          } 
          this.onClose();
          break;
        case ExportAs.JPG:
          
            /*
            var data = (new XMLSerializer()).serializeToString(canvas);
            var blob = new Blob([data], {type:"image/svg+xml;charset=utf-8"});
            this.download(name+'.jpeg', blob);
            */
           img.onload = function() {
            if(canvas !== null && ctx !== null){
              ctx.drawImage(img, 0, 0);
              var a = document.createElement("a");
              a.download = name+'.jpeg';
              a.href = canvas.toDataURL("image/jpeg");
              a.click();
            };
          }
           
          this.onClose();
          break;
        case ExportAs.BMP:
          
            /*
            var data = (new XMLSerializer()).serializeToString(canvas);
            var blob = new Blob([data], {type:"image/svg+xml;charset=utf-8"});
            this.download(name+'.bmp', blob);
            */
          
           img.onload = function() {
            if(canvas !== null && ctx !== null){
            ctx.drawImage(img, 0, 0);
            var a = document.createElement("a");
            a.download = name+'.bmp';
            a.href = canvas.toDataURL("image/bmp");
            a.click();
              };
            }
          this.onClose();
          break;
      }
    
  }

  download(filename: string, blob:Blob){ 
    //var domUrl = window.URL || window.webkitURL || window;
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
