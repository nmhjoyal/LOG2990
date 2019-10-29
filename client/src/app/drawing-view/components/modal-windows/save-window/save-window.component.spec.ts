import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatButtonModule, MatDialogModule, MatDialogRef, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { IndexService } from 'src/app/services/index/index.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { Strings } from 'src/AppConstants/Strings';
import { IDrawing } from '../../../../../../../common/drawing-information/IDrawing';
import { ITag } from '../../../../../../../common/drawing-information/ITag';
import { ISaveModalData } from './ISaveModalData';
import { SaveWindowComponent } from './save-window.component';

describe('SaveWindowComponent', () => {
    let dialogRefMock: SpyObj<MatDialogRef<SaveWindowComponent>>;
    let component: SaveWindowComponent;
    let fixture: ComponentFixture<SaveWindowComponent>;
    const dataMock: SpyObj<ISaveModalData> = jasmine.createSpyObj('ISaveModalData', ['']);
    const canvasDataMock: SpyObj<CanvasInformationService> = jasmine.createSpyObj('CanvasInformationService', ['']);
    const toolHandlerMock: SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['clearPage']);
    const indexMock: SpyObj<IndexService> = jasmine.createSpyObj('IndexService', ['basicGet', 'getTags', 'saveTag', 'saveDrawing']);
    const tag = { name: 'tag', isSelected: true };
    const tag2 = { name: 'tag2', isSelected: false };

    const mockDrawing = {
        name: 'name',
        tags: [tag, tag2],
        timestamp: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
        shapes: toolHandlerMock.drawings,
        canvas: canvasDataMock.data,
    } as IDrawing;

    const dialogMock = {
        close: () => {
            confirm('MockDialog close');
        },
    };

    beforeEach(async(() => {
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
                { provide: MatDialogRef, useValue: { dialogMock } },
                { provide: MAT_DIALOG_DATA, useValue: dataMock },
                { provide: ToolHandlerService, useValue: toolHandlerMock },
                { provide: CanvasInformationService, useValue: canvasDataMock },
                { provide: IndexService, useValue: indexMock },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        dialogRefMock = jasmine.createSpyObj('MatDialogRef<SaveWindowComponent>', ['close']);
        fixture = TestBed.createComponent(SaveWindowComponent);
        component = new SaveWindowComponent(dialogRefMock, dataMock, canvasDataMock, toolHandlerMock, indexMock);
        component.data.displayedTags = [tag, tag2];
        component['name'] = 'drawing';
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

    it('#onAcceptClick should properly save drawings and tags', async () => {
        const closeSpy = spyOn(component, 'onClose');

        component.onAcceptClick();
        expect(component.isFinishedSaving).toBe(true);
        expect(closeSpy).toHaveBeenCalled();
    });

    it('constructor should properly initialize', () => {
        const newComponent = new SaveWindowComponent(dialogRefMock, dataMock, canvasDataMock, toolHandlerMock, indexMock);
        expect(newComponent.data.title).toBe(Strings.SAVE_WINDOW_TITLE);
        expect(newComponent.isFinishedSaving).toBe(true);
    });

});
