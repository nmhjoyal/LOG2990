import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatButtonModule, MatDialogModule, MatDialogRef, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { IndexService } from 'src/app/services/index/index.service';
import { ITag } from '../../../../../../../common/drawing-information/ITag';
import { SaveWindowComponent } from './save-window.component';
import { ISaveModalData } from './ISaveModalData';
import { CanvasInformationService } from 'src/app/services/canvas-information/canvas-information.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';

describe('SaveWindowComponent', () => {
    let dialogRefMock: SpyObj<MatDialogRef<SaveWindowComponent>>;
    let component: SaveWindowComponent;
    let fixture: ComponentFixture<SaveWindowComponent>;
    const dataMock: SpyObj<ISaveModalData> = jasmine.createSpyObj('ISaveModalData', ['']);
    const canvasDataMock: SpyObj<CanvasInformationService> = jasmine.createSpyObj('CanvasInformationService', ['']);
    const toolHandlerMock: SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['clearPage']);
    const indexMock: SpyObj<IndexService> = jasmine.createSpyObj('IndexService', ['getTags', 'saveTag']);

    const dialogMock = {
        close: () => {
            confirm('MockDialog close');
        },
    };

    beforeEach(async(() => {
        indexMock.getTags.and.callFake(() => new Observable<ITag[]>());
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
        const tag = { name: 'tag', isSelected: true } as ITag;
        component.clickOnTag(tag);
        expect(tag.isSelected).toBe(false);

        const tag2 = { name: 'tag2', isSelected: false } as ITag;
        component.clickOnTag(tag2);
        expect(tag2.isSelected).toBe(true);
    });

    it('#addTag should add the tag if it exists and is not in the list of tags', () => {
        const tag = { name: 'tag', isSelected: true } as ITag;
        const tag2 = { name: 'tag2', isSelected: false } as ITag;

        component.data.displayedTags = [tag, tag2];

        component.addTag('');
        expect(component.data.displayedTags).toEqual([tag, tag2]);

        component.addTag('tag');
        expect(component.data.displayedTags).toEqual([tag, tag2]);

        component.addTag('tag3');
        expect(component.data.displayedTags).toEqual([tag, tag2, { name: 'tag3', isSelected: true }]);
    });


});
