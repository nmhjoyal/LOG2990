// tslint:disable: no-string-literal

import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatButtonModule, MatDialogModule, MatDialogRef, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { DrawingStorageService } from 'src/app/services/drawing-storage/drawing-storage.service';
import { ClientStorageService } from 'src/app/services/index/client-storage.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Strings } from 'src/AppConstants/Strings';
import { IDrawing } from '../../../../../../../common/drawing-information/IDrawing';
import { ITag } from '../../../../../../../common/drawing-information/ITag';
import { ISaveModalData } from './ISaveModalData';
import { SaveWindowComponent } from './save-window.component';

describe('SaveWindowComponent', () => {
    const dialogRefMock: SpyObj<MatDialogRef<SaveWindowComponent>> = jasmine.createSpyObj('MatDialogRef<SaveWindowComponent>', ['close']);
    let component: SaveWindowComponent;
    let fixture: ComponentFixture<SaveWindowComponent>;
    const dataMock: SpyObj<ISaveModalData> = jasmine.createSpyObj('ISaveModalData', ['']);
    const canvasDataMock: SpyObj<CanvasInformationService> = jasmine.createSpyObj('CanvasInformationService', ['']);
    const toolHandlerMock: SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['resetToolSelection']);
    const drawingStorageMock: SpyObj<DrawingStorageService> = jasmine.createSpyObj('DrawingStorageService', ['emptyDrawings'] );
    let indexMock: SpyObj<ClientStorageService>;
    let confirmSpy;
    const tag = { name: 'tag', isSelected: true } as ITag;
    const tag2 = { name: 'tag2', isSelected: false } as ITag;

    drawingStorageMock.drawings = [{
        id: '',
        points: '',
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        svgReference: '',
        vertices: '',
        primaryColour: '',
        secondaryColour: '',
        strokeOpacity: 0,
        strokeWidth: 0,
        fillOpacity: 0,
        verticesNumber: 0,
        colour: '',
        fill: '',
        strokeLinecap: '',
        strokeLinejoin: '',
        filter: '',
        angle: 0,
        scaleFactor: 0,
        centerX: 0,
        centerY: 0,
    }];

    canvasDataMock.data = {
        drawingColour: '',
        drawingHeight: 0,
        drawingWidth: 0,
    };

    const mockDrawing = {
        name: 'name',
        tags: [tag, tag2],
        timestamp: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
        shapes: [],
        canvas: canvasDataMock.data,
    } as IDrawing;

    const dialogMock = {
        close: () => {
            confirm('MockDialog close');
        },
    };

    beforeEach(async(() => {
        indexMock = jasmine.createSpyObj('IndexService', ['getTags', 'saveTag', 'saveDrawing']);
        confirmSpy = spyOn(window, 'confirm');
        indexMock.getTags.and.callFake(() => new Observable<ITag[]>());
        indexMock.saveTag.and.callFake(() => new Observable<boolean>());
        indexMock.saveDrawing.and.callFake(() => new Observable<boolean>());

        TestBed.configureTestingModule({
            declarations: [SaveWindowComponent],
            imports: [
                HttpClientModule,
                MatDialogModule,
                FormsModule,
                MatFormFieldModule,
                MatInputModule,
                BrowserAnimationsModule,
                MatButtonModule,
            ],
            providers: [
                DrawingStorageService,
                { provide: MatDialogRef, useValue: { dialogMock } },
                { provide: MAT_DIALOG_DATA, useValue: dataMock },
                { provide: ToolHandlerService, useValue: toolHandlerMock },
                { provide: DrawingStorageService, useValue: drawingStorageMock },
                { provide: CanvasInformationService, useValue: canvasDataMock },
                { provide: ClientStorageService, useValue: indexMock },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveWindowComponent);
        component = new SaveWindowComponent(dialogRefMock, dataMock, canvasDataMock, drawingStorageMock, indexMock);
        component.data.displayedTags = [tag, tag2];
        component['name'] = 'drawing';
        mockDrawing.shapes = TestBed.get(DrawingStorageService).drawings;
        component.data.drawing = mockDrawing;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onClose should call dialogRef.close', () => {
        component.onClose();
        expect(dialogRefMock.close).toHaveBeenCalled();
    });

    it('#clickOnTag should properly invert tag selection status', () => {
        const testTag1 = { name: 'tag', isSelected: true } as ITag;
        component.clickOnTag(testTag1);
        expect(testTag1.isSelected).toBe(false);

        const testTag2 = { name: 'tag2', isSelected: false } as ITag;
        component.clickOnTag(testTag2);
        expect(testTag2.isSelected).toBe(true);
    });

    it('#addTag should add the tag if it exists and is not in the list of tags', () => {
        component.addTag('');
        expect(component.data.displayedTags).toEqual([tag, tag2]);

        component.addTag('tag');
        expect(component.data.displayedTags).toEqual([tag, tag2]);

        component.addTag('tag3');
        expect(component.data.displayedTags).toEqual([tag, tag2, { name: 'tag3', isSelected: true }]);
    });

    it('constructor should properly initialize', () => {
        const newComponent = new SaveWindowComponent(dialogRefMock, dataMock, canvasDataMock, drawingStorageMock, indexMock);
        newComponent.data.displayedTags = [{ name: 'tag', isSelected: true } as ITag];
        expect(newComponent.data.title).toBe(Strings.SAVE_WINDOW_TITLE);
        expect(newComponent['isFinishedSaving']).toBe(true);
    });

    it('should properly call onAcceptClick', () => {
        component.onAcceptClick();
        indexMock.saveTag.and.returnValue(of(true));
        expect(component['isFinishedSaving']).toEqual(true);
        expect(component.data.displayedTags).toEqual([tag, tag2]);
    });

    it('should NOT call confirm window on defined tag response in onAcceptClick', () => {
        confirmSpy  = spyOn(window, 'confirm').and.returnValue(true);
        const spy = spyOn(component, 'onClose');
        component.data.displayedTags = [tag];
        indexMock.saveDrawing.and.returnValue(of(true));
        indexMock.saveTag.and.returnValue(of(true));
        component.onAcceptClick();
        expect(spy).toHaveBeenCalled();
        expect(confirmSpy).not.toHaveBeenCalled();
    });

    it('should call confirm window on undefined drawing response in onAcceptClick', () => {
        confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
        const spy = spyOn(component, 'onClose');
        indexMock.saveDrawing.and.returnValue(of(undefined));
        component.onAcceptClick();
        expect(spy).toHaveBeenCalled();
        expect(confirmSpy).toHaveBeenCalled();
    });

    it('should correctly get the tags from the server', () => {
        indexMock.getTags.and.returnValue(of([tag, tag2]));
        component = new SaveWindowComponent(dialogRefMock, dataMock, canvasDataMock, drawingStorageMock, indexMock);
        expect(component.data.displayedTags).toEqual([tag, tag2]);
    });

    it('should correctly get initialize an empty array if the response is undefined', () => {
        indexMock.getTags.and.returnValue(of(undefined));
        component = new SaveWindowComponent(dialogRefMock, dataMock, canvasDataMock, drawingStorageMock, indexMock);
        expect(component.data.displayedTags).toEqual([]);
    });

    it('should properly initialize tags to an empty array if they have no tags', () => {
        indexMock.getTags.and.returnValue(of([tag, tag2]));
        component = new SaveWindowComponent(dialogRefMock, dataMock, canvasDataMock, drawingStorageMock, indexMock);
        expect(component.data.displayedTags).toEqual([tag, tag2]);
    });

    it('should save locally', () => {
        const clickSpy = spyOn(HTMLElement.prototype, 'click');
        component.saveToLocal('mock');
        expect(clickSpy).toHaveBeenCalled();
    });
});
