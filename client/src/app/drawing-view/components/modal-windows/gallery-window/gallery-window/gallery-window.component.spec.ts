import SpyObj = jasmine.SpyObj;
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatButtonModule, MatButtonToggleModule, MatDialogModule, MatDialogRef, MatInputModule, MatMenuModule, MatProgressSpinnerModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ModalWindowComponent } from '../../modal-window/modal-window.component';
import { GalleryWindowComponent } from './gallery-window.component';
import { IGalleryModalData } from './IGalleryModalData';
import { PreviewCanvasComponent } from '../preview-canvas/preview-canvas/preview-canvas.component';
import { FilterTagsPipe } from 'src/app/services/filter-tags.pipe';
import { IndexService } from 'src/app/services/index/index.service';
import { Observable, of } from 'rxjs';
import { ITag } from '../../../../../../../../common/drawing-information/ITag';
import { IDrawing } from '../../../../../../../../common/drawing-information/IDrawing';
import { Strings } from 'src/AppConstants/Strings';

// export class FilterTagsPipeMock {
//   transform() {

//   }
// }

describe('GalleryWindowComponent', () => {
    let dialogRefMock: SpyObj<MatDialogRef<GalleryWindowComponent>>;
    const dataMock: SpyObj<IGalleryModalData> = jasmine.createSpyObj('IGalleryModalData', ['']);
    const canvasInformationMock: SpyObj<CanvasInformationService> = jasmine.createSpyObj('CanvasInformationService', ['']);
    const toolHandlerServiceMock: SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['clearPage']);
    const indexServiceMock: SpyObj<IndexService> = jasmine.createSpyObj('IndexService', ['getTags', 'getDrawings', 'getDrawing']);
    const tag = { name: 'tag', isSelected: true } as ITag;
    const tag2 = { name: 'tag2', isSelected: false } as ITag;
    const mockDrawing = {
        name: 'name',
        tags: [tag, tag2],
        timestamp: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
        shapes: toolHandlerServiceMock.drawings,
        canvas: canvasInformationMock.data,
    } as IDrawing;


    let component: GalleryWindowComponent;
    let fixture: ComponentFixture<GalleryWindowComponent>;

    beforeEach(async(() => {
        indexServiceMock.getTags.and.callFake(() => new Observable<ITag[]>());
        indexServiceMock.getDrawings.and.callFake(() => new Observable<IDrawing[]>())

        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                MatDialogModule,
                MatButtonModule,
                MatButtonToggleModule,
                MatInputModule,
                BrowserAnimationsModule,
                FormsModule,
                MatMenuModule,
                MatProgressSpinnerModule,
            ],
            declarations: [
                GalleryWindowComponent,
                ModalWindowComponent,
                PreviewCanvasComponent,
                FilterTagsPipe,
            ],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefMock },
                { provide: MAT_DIALOG_DATA, useValue: dataMock },
                { provide: ToolHandlerService, useValue: toolHandlerServiceMock },
                { provide: CanvasInformationService, useValue: canvasInformationMock },
                { provide: IndexService, useValue: indexServiceMock }
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryWindowComponent);
        component = new GalleryWindowComponent(dialogRefMock, dataMock, canvasInformationMock, toolHandlerServiceMock, indexServiceMock);
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have the appropriate constructor values', () => {
        expect(component.data.title).toEqual(Strings.GALLERY_WINDOW_TITLE)
        expect(component['drawingsInGallery']).toEqual([]);
        expect(component['selectedDrawing']).toEqual({} as IDrawing);
        expect(component['drawingToOpen']).toEqual({} as IDrawing);
        expect(component.isFinishedLoading).toEqual(false);
    })

    it('should assign the server tags to the filterTags if they are present', () => {
        indexServiceMock.getTags.and.returnValue(of([tag, tag2]));
        component = new GalleryWindowComponent(dialogRefMock, dataMock, canvasInformationMock, toolHandlerServiceMock, indexServiceMock);
        expect(component.data.filterTags).toEqual([tag, tag2]);
    })


    it('should create a new array if there are no tags in the server', () => {
        indexServiceMock.getTags.and.returnValue(of([]));
        component = new GalleryWindowComponent(dialogRefMock, dataMock, canvasInformationMock, toolHandlerServiceMock, indexServiceMock);
        expect(component.data.filterTags).toEqual([]);
    });

    it('should properly retrieve drawings in ngOnInit', () => {
        indexServiceMock.getDrawings.and.returnValue(of([mockDrawing]));
        component.ngOnInit();
        expect(component['drawingsInGallery']).toEqual([mockDrawing]);
        expect(component.isFinishedLoading).toBe(true);
    });

    it('#onSelect should properly assign the drawing', () => {
        component.onSelect(mockDrawing);
        expect(component['selectedDrawing']).toEqual(mockDrawing);
    })
});
