import { Injectable } from '@angular/core';
import { IExportData } from 'src/app/drawing-view/components/modal-windows/export-window/IExportData';

@Injectable({
  providedIn: 'root',
})

export class ExportInformationService {
  data: IExportData;
}
