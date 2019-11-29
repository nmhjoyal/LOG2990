// tslint:disable: no-string-literal

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveService } from 'src/app/services/save-service/save.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import { ColourService } from '../../../../../services/colour_service/colour.service';
import { DrawingStorageService } from '../../../../../services/drawing-storage/drawing-storage.service';
import { EraserConstants } from '../../assets/constants/eraser-constants';
import { Id } from '../../assets/constants/tool-constants';
import { IShape } from '../../assets/interfaces/shape-interface';
import { EraserComponent } from './eraser.component';

describe('EraserComponent', () => {
  let component: EraserComponent;
  let fixture: ComponentFixture<EraserComponent>;
  let rectangleMock: IShape;
  const INITIAL_COORDINATE = 0;
  const UNMATCHING_COORDINATE = 20;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EraserComponent ],
      providers: [
        DrawingStorageService,
        SaveService,
        UndoRedoService,
        ColourService,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EraserComponent);
    component = fixture.componentInstance;
    component.drawingStorage.emptyDrawings();

    rectangleMock = {
      id: 'rectangle',
      x: INITIAL_COORDINATE,
      y: INITIAL_COORDINATE,
      width: 20,
      height: 20,
      verticesNumber: 4,
      vertices: '',
      primaryColour: '',
      secondaryColour: '',
      strokeOpacity: 1,
      strokeWidth: 1,
      fillOpacity: 1,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set leftClicked to true when mouse is clicked', () => {
    component.mouseDown();
    expect(component['leftClicked']).toBeTruthy();
  });

  it('should set leftClicked to false when mouseup', () => {
    component.mouseUp();
    expect(component['leftClicked']).toBeFalsy();
  });

  it('should have initial (0,460) x/y coordinates', () => {
    const DEFAULT_X = 0;
    const DEFAULT_Y = 460;
    expect(component['eraser'].x).toBe(DEFAULT_X);
    expect(component['eraser'].y).toBe(DEFAULT_Y);
  });

  it('should initialize correct eraser properties', () => {
    const DEFAULT_SIZE = 10;
    const mouseeventMock = new MouseEvent('mousemove');
    component.setEraserProperties(mouseeventMock);
    expect(component['eraser'].width).toBe(DEFAULT_SIZE);
    expect(component['eraser'].height).toBe(DEFAULT_SIZE);
    expect(component['eraser'].x).toBe(mouseeventMock.offsetX);
    expect(component['eraser'].y).toBe(mouseeventMock.offsetX);
  });

  it('should delete object by changing its id', () => {
    component.drawingStorage.saveDrawing(rectangleMock);
    component['eraser'].x = 0;
    component['eraser'].y = 0;

    component.eraseObject();
    const poppedObject = component.drawingStorage.drawings.pop();
    if (poppedObject && poppedObject.objects && poppedObject.objects[0]) {
      expect(poppedObject.objects[0].id).toBe(Id.ERASER);
    }
  });

  it('should not affect object with non-sharing area', () => {
    rectangleMock.x = UNMATCHING_COORDINATE;
    rectangleMock.y = UNMATCHING_COORDINATE;

    component.drawingStorage.saveDrawing(rectangleMock);

    component['eraser'].x = INITIAL_COORDINATE;
    component['eraser'].y = INITIAL_COORDINATE;
    const rectangleId = component.drawingStorage.drawings[0].id;
    expect(rectangleId).toBe('rectangle');
  });

  it('should not call eraseObject if leftClicked is false', () => {
    component['leftClicked'] = false;
    const mouseeventMock = new MouseEvent('mousemove');
    spyOn(component, 'eraseObject');
    component.mouseMove(mouseeventMock);
    expect(component.eraseObject).not.toHaveBeenCalled();
  });

  it('should call eraseObject if leftClicked is true', () => {
    component['leftClicked'] = true;
    const mouseeventMock = new MouseEvent('mousemove');
    spyOn(component, 'eraseObject');
    component.mouseMove(mouseeventMock);
    expect(component.eraseObject).toHaveBeenCalled();
  });

  it('should outline red on matching coordinates', () => {
    component.drawingStorage.saveDrawing(rectangleMock);
    component['eraser'].x = INITIAL_COORDINATE;
    component['eraser'].y = INITIAL_COORDINATE;
    component.toggleRedOutline();
    expect(rectangleMock.secondaryColour).toBe('red');
  });

  it('should not outline red if coordinates do not match', () => {
    rectangleMock.x = UNMATCHING_COORDINATE;
    rectangleMock.y = UNMATCHING_COORDINATE;
    rectangleMock.secondaryColour = 'secondary';

    component.drawingStorage.saveDrawing(rectangleMock);
    component['eraser'].x = INITIAL_COORDINATE;
    component['eraser'].y = INITIAL_COORDINATE;
    component.toggleRedOutline();
    expect(rectangleMock.secondaryColour).toBe('secondary');
  });

  it('should set object outline colour back to default when hovered off', () => {
    component.colourService.colour[1] = 'black';
    rectangleMock.x = UNMATCHING_COORDINATE;
    rectangleMock.y = UNMATCHING_COORDINATE;
    rectangleMock.secondaryColour = 'red';

    component.drawingStorage.saveDrawing(rectangleMock);
    component.drawingStorage = component.drawingStorage;
    component.colourService = component.colourService;
    component['eraser'].x = INITIAL_COORDINATE;
    component['eraser'].y = INITIAL_COORDINATE;
    component.toggleRedOutline();
    expect(rectangleMock.secondaryColour).toBe('black');
  });

  it('should validate size on change', () => {
    component['size'] = EraserConstants.DEFAULT_ERASER_SIZE;
    component.validateSize();
    expect(component['size']).toEqual(EraserConstants.DEFAULT_ERASER_SIZE);
    component['size'] = EraserConstants.MAX_ERASER_SIZE + 1;
    component.validateSize();
    expect(component['size']).toEqual(EraserConstants.MAX_ERASER_SIZE);
    component['size'] = 0;
    component.validateSize();
    expect(component['size']).toEqual(1);
  });

});
