// tslint:disable: no-string-literal

import SpyObj = jasmine.SpyObj;
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
    MAT_DIALOG_DATA, MatButtonModule, MatButtonToggleModule, MatDialogModule,
    MatDialogRef, MatInputModule, MatMenuModule, MatProgressSpinnerModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { FilterTagsPipe } from 'src/app/services/filter-pipe/filter-tags.pipe';
import { IndexService } from 'src/app/services/index/index.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Strings } from 'src/AppConstants/Strings';
import { IDrawing } from '../../../../../../../../common/drawing-information/IDrawing';
import { ITag } from '../../../../../../../../common/drawing-information/ITag';
import { ModalWindowComponent } from '../../modal-window/modal-window.component';
import { PreviewCanvasComponent } from '../preview-canvas/preview-canvas/preview-canvas.component';
import { GalleryWindowComponent } from './gallery-window.component';
import { IGalleryModalData } from './IGalleryModalData';

describe('GalleryWindowComponent', () => {
    jasmine.getEnv().allowRespy(true);
    const dialogRefMock: SpyObj<MatDialogRef<GalleryWindowComponent>> =
        jasmine.createSpyObj('MatDialogRef<SaveWindowComponent>', ['close']);
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
        indexServiceMock.getDrawings.and.callFake(() => new Observable<IDrawing[]>());
        indexServiceMock.getDrawing.and.callFake(() => new Observable<IDrawing>());

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
                { provide: IndexService, useValue: indexServiceMock },
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
        expect(component.data.title).toEqual(Strings.GALLERY_WINDOW_TITLE);
        expect(component['drawingsInGallery']).toEqual([]);
        expect(component['selectedDrawing']).toEqual({} as IDrawing);
        expect(component['drawingToOpen']).toEqual({} as IDrawing);
        expect(component.isFinishedLoading).toEqual(false);
    });

    it('should assign the server tags to the filterTags if they are present', () => {
        indexServiceMock.getTags.and.returnValue(of([tag, tag2]));
        component = new GalleryWindowComponent(dialogRefMock, dataMock, canvasInformationMock, toolHandlerServiceMock, indexServiceMock);
        expect(component.data.filterTags).toEqual([tag, tag2]);
    });

    it('should create a new array if there are no tags in the server', () => {
        indexServiceMock.getTags.and.returnValue(of(undefined));
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
    });

    it('should properly search for user input tag', () => {
        const spy = spyOn(component, 'tagSelected');
        const spyWindow = spyOn(window, 'confirm');

        component.data.filterTags = [tag, tag2];
        component.addTag('tag');
        expect(spy).toHaveBeenCalledWith('tag');
        component.addTag('mockTag');
        expect(spyWindow).toHaveBeenCalledWith('Il n\'y a pas de dessin avec cette étiquette');
    });

    it('#tagsSelected should properly filter the drawings', () => {
        component.tagSelected('all');
        expect(component.filterBy).toEqual(['all']);

        component.tagSelected('all, tag');
        expect(component.filterBy).toEqual(['all, tag']);
    });

    it('should properly call onAcceptClick', () => {
        const spy = spyOn(component, 'onClose');
        indexServiceMock.getDrawing.and.returnValue(of(mockDrawing));
        component.onAcceptClick();
        expect(component['drawingToOpen']).toEqual(mockDrawing);
        expect(toolHandlerServiceMock.drawings).toEqual(mockDrawing.shapes);
        expect(canvasInformationMock.data).toEqual(mockDrawing.canvas);
        expect(spy).toHaveBeenCalled();
    });

    it('should call confirm window on undefined response in onAcceptClick', () => {
        const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        const spy = spyOn(component, 'onClose');
        indexServiceMock.getDrawing.and.returnValue(of(undefined));
        component.onAcceptClick();
        expect(spy).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
    });

    it('should remove tags if they are duplicates', () => {
        const spy = spyOn(Array.prototype, 'splice')
        component.filterBy = ['tag', 'tag2', 'tag3'];
        component.tagSelected('tag');
        expect(spy).toHaveBeenCalled();
    });

    it('should call not get a drawing in onAcceptClick if none is selected', () => {
        const spy = spyOn(indexServiceMock, 'getDrawing').and.returnValue(of(false));
        component['selectedDrawing'] = undefined;
        component.onAcceptClick();
        expect(spy).not.toHaveBeenCalled();
    });

});
