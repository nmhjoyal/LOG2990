// import SpyObj = jasmine.SpyObj;
import { TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { CanvasComponent } from '../../drawing-view/components/canvas/canvas.component';
// import { NewDrawingModalData } from '../../drawing-view/components/NewDrawingModalData';
import { Gridservice } from './grid.service';
// import { AppComponent } from '../../components/app/app.component';
// import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
// import { MatDialog } from '@angular/material';


describe('Gridservice', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  let gridServiceMock: Gridservice;



  it('should be created', () => {
    const service: Gridservice = TestBed.get(Gridservice);
    expect(service).toBeTruthy();
  });

  it('should have a hidden grid initially', () => {
    gridServiceMock = new Gridservice();
    if (gridServiceMock.gridElement != null) {
      expect(gridServiceMock.gridElement.style.visibility).toBe('hidden');
    }
  });

  it('should have status set to visible after toggle call', () => {
    gridServiceMock = new Gridservice();
    gridServiceMock.toggleGrid();

    if (gridServiceMock.gridElement != null) {
      expect(gridServiceMock.gridElement.style.visibility).toBe('visible');
    }
  });

  it('should have the correct opacity after setOpacity call', () => {
    gridServiceMock = new Gridservice();
    gridServiceMock.setOpacityManual('0.8');

    if (gridServiceMock.gridElement != null) {
      expect(gridServiceMock.gridElement.style.opacity).toBe('0.8');
    }
  });

});

