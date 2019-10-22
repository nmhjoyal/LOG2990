import { Component, HostListener, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { INewDrawingModalData } from 'src/app/drawing-view/components/new-drawing-window/INewDrawingModalData';
import { NewDrawingWindowComponent } from 'src/app/drawing-view/components/new-drawing-window/new-drawing-window.component';
import { WelcomeWindowComponent } from 'src/app/drawing-view/components/welcome-window/welcome-window.component';
import { ColorService } from 'src/app/services/color_service/color.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { Strings } from 'src/AppConstants/Strings';
import { ColorPickerComponent } from '../../drawing-view/components/color-picker/color-picker.component';
import { GridService } from '../../services/grid_service/grid.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private dialog: MatDialog, private storage: LocalStorageService, public colorService: ColorService,
              protected toolHandler: ToolHandlerService, protected gridService: GridService,
              @Inject(MAT_DIALOG_DATA) private data: INewDrawingModalData) {
    this.data.drawingHeight = window.innerHeight - NumericalValues.TITLEBAR_WIDTH;
    this.data.drawingWidth = window.innerWidth - NumericalValues.SIDEBAR_WIDTH;
    this.data.drawingColor = Strings.WHITE_HEX;
  }

  @HostListener('document:keydown.c', ['$event']) onKeydownCEvent(): void {
      this.toolHandler.chooseCrayon();
  }

  @HostListener('document:keydown.w', ['$event']) onKeydownWEvent(): void {
      this.toolHandler.choosePaintbrush();
  }
  @HostListener('document:keydown.control.o', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    event.preventDefault();
    this.confirmNewDrawing();
  }

  @HostListener('document:keydown.1', ['$event']) onKeydown1(): void {
      this.toolHandler.chooseRectangle();
  }

  @HostListener('document:keydown.2', ['$event']) onKeydown2(): void {
      this.toolHandler.chooseEllipse();
  }

  confirmNewDrawing(): void {
    if (!this.dialog.openDialogs.length) {
      if (!this.toolHandler.drawings.length) {
        this.openNewDrawingDialog();
      } else if (confirm('Si vous continuez, vous perdrez vos changements. Êtes-vous sûr(e)?')) {
        this.openNewDrawingDialog();
      }
    }
  }

  openNewDrawingDialog(): void {
    this.dialog.open(NewDrawingWindowComponent, {
      data: NewDrawingWindowComponent.prototype.data,
      panelClass: 'new-drawing-window',
    });
  }

  ngOnInit(): void {
    this.openWelcomeScreen();
  }

  openWelcomeScreen(): void {
    const showAgain = this.storage.getShowAgain();
    if (showAgain) {
      this.dialog.open(WelcomeWindowComponent, {
        data: { storage: this.storage },
        disableClose: true,
      });
    }
  }

  toggleGrid(): void {
    this.gridService.toggleGrid();
  }

  setOpacity(): void {
    let stringValue = (document.getElementById('opacitySlider') as HTMLInputElement).value;
    const numberValue = Number(stringValue) / NumericalValues.GRID_MAX;      // Car 'slider' va de 0 à 100 pour plus de precision.
    stringValue = String(numberValue);              // Remettre en String.
    this.gridService.setOpacity(stringValue);
  }

  setSize(): void {
    const stringValue = (document.getElementById('sizeSlider') as HTMLInputElement).value;
    this.gridService.setSize(stringValue);

  }

  openChooseColorDialog(): void {
    this.dialog.open(ColorPickerComponent, {
      panelClass: 'choose-color-window',
    });
  }

  switchColours(): void {
    this.colorService.switchColors();
    if (!this.toolHandler.colourApplicatorSelected) {
      this.toolHandler.resetSelection();
    }
  }

}
