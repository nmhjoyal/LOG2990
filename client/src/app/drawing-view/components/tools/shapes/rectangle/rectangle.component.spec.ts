import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { RectangleComponent } from './rectangle.component';

const STROKEWIDTH = 10;
const INITIALX = 150;
const INITIALY = 200;
const CURSORX = 550;
const CURSORY = 700;
const CURSOR_MOVE = 300;

describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;
  const toolServiceMock: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule],
      declarations: [RectangleComponent],
      providers: [
        { provide: ToolHandlerService, useValue: toolServiceMock, },
      ],

    })
      .compileComponents();
  }));


  // tslint:disable:no-string-literal
  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component['shape'].strokeWidth = STROKEWIDTH;
    component['initialX'] = INITIALX;
    component['initialY'] = INITIALY;
    component['cursorX'] = CURSORX;
    component['cursorY'] = CURSORY;
    component['mouseDown'] = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#calculateDimensions should make both the width and height equals to the smallest of the two when shift is pressed', () => {
    
    expect(component['shape'].width).toEqual(component['previewBox'].width - STROKEWIDTH, 'width unchanged when shift is not pressed');
    expect(component['shape'].height).toEqual(component['previewBox'].height - STROKEWIDTH, 'height unchanged when shift is not pressed');
    
    component.onShiftDown();

    expect(component['shape'].height).toBe(component['shape'].width, 'height took width\'s value');

    component['cursorY'] -= CURSOR_MOVE;
    component.onShiftDown();

    expect(component['shape'].height).toBe(component['previewBox'].height - STROKEWIDTH, 'height unchanged when it is the smallest value');
    expect(component['shape'].width).toBe(component['shape'].height, 'width took height\'s value');

  });

  it('#calculateDimensions should not alter the values of the shape\'s width and height when shift is released', () =>{
    component.onShiftDown();
    
    expect(component['shape'].height).toBe(component['shape'].width, 'height took width\'s value');

    component.onShiftUp();

    expect(component['shape'].height === component['shape'].width).toBeFalsy( 'ERROR: height took width\'s value');

  });

});
