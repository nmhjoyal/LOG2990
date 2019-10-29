import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatButtonModule, MatDialogModule, MatDialogRef, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ColorPaletteComponent } from '../../../color-picker/color-palette/color-palette.component';
import { ModalWindowComponent } from '../../modal-window/modal-window.component';
import { INewDrawingModalData } from '../../new-drawing-window/INewDrawingModalData';
import { GalleryWindowComponent } from './gallery-window.component';
import { IGalleryModalData } from './IGalleryModalData';

   // tslint:disable: no-any
describe('GalleryWindowComponent', () => {
  let component: GalleryWindowComponent;
  let fixture: ComponentFixture<GalleryWindowComponent>;
  let dataMock: SpyObj<INewDrawingModalData>;

  const storageServiceMock: SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['clearPage']);
  dataMock = jasmine.createSpyObj('GalleryDrawingModalData', ['']);
  let galleryData: SpyObj<IGalleryModalData>;

    const dialogMock = {
      close: () => {
        confirm('MockDialog close');
      },
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          MatDialogModule,
          FormsModule,
          MatFormFieldModule,
          MatInputModule,
          BrowserAnimationsModule,
          MatButtonModule,
        ],
        declarations: [
          ModalWindowComponent,
          GalleryWindowComponent,
          ColorPaletteComponent,
        ],
        providers: [
          { provide: MatDialogRef, useValue: dialogMock },
          { provide: MAT_DIALOG_DATA, useValue: dataMock },
          { provide: MAT_DIALOG_DATA, useValue: galleryData },
          { provide: ToolHandlerService, useValue: storageServiceMock },
        ],
      })
        .overrideComponent(GalleryWindowComponent, {
          set: { changeDetection: ChangeDetectionStrategy.Default },
        })
        .compileComponents();
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    galleryData = jasmine.createSpyObj('IGalleryModalData', []);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should call index.getDrawings', () => {
    component.ngOnInit();
    expect((component as any).index.getDrawings().subscribe).toHaveBeenCalled();
  });

  it('#ngOnInit should call gallerySubscription.unsubscribe', () => {
    component.ngOnDestroy();
    expect((component as any).gallerySubscription.unsubscribe).toHaveBeenCalled();
  });

  it('onAcceptClick should call index.getDrawings if selectedDrawingExists', () => {
    component.onAcceptClick();
    (component as any).selectedDrawing = false;
    expect((component as any).index.getDrawing).toHaveBeenCalled();
  });

  it('tagSelected should change filterby to all if tag selected is all', () => {
    component.tagSelected('all');
    (component as any).selectedDrawing = false;
    expect((component as any).filterBy.toEqual(['all']));
  });

  it('tagSelected should change filterby to [] if tag selected includes all', () => {
    component.tagSelected('none all');
    (component as any).selectedDrawing = false;
    expect((component as any).filterBy.toEqual(['[]']));
  });

  it('addTag should call tagSelected if tag is added', () => {
    component.addTag('none');
    expect(component.tagSelected).toHaveBeenCalled();
  });

  it('addTag should not call tagSelected if tag empty', () => {
    component.addTag('');
    expect(component.tagSelected).not.toHaveBeenCalled();
  });

});
