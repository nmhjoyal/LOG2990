// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../assets/attributes/attributes.service';
import { StampComponent } from './stamp.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('StampComponent', () => {
    let component: StampComponent;
    let attrService: AttributesService;
    let fixture: ComponentFixture<StampComponent>;
    const toolServiceMock: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);
    const attributesServiceMock: AttributesService = new AttributesService();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StampComponent],
            imports: [BrowserDynamicTestingModule],
            providers: [
            { provide: ToolHandlerService, useValue: toolServiceMock, },
            { provide: AttributesService, useValue: attributesServiceMock, },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StampComponent);
        component = fixture.componentInstance;
        attrService = TestBed.get(attributesServiceMock);
    });


});