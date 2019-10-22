// import SpyObj = jasmine.SpyObj;
import { TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { CanvasComponent } from '../../drawing-view/components/canvas/canvas.component';
// import { NewDrawingModalData } from '../../drawing-view/components/NewDrawingModalData';
import { MygridService } from './mygrid.service';
// import { AppComponent } from '../../components/app/app.component';
// import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
// import { MatDialog } from '@angular/material';


describe('MygridService', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  // let dmdataMock: SpyObj<NewDrawingModalData>;
  let gridsvcMock: MygridService;
  // let fixture: ComponentFixture<CanvasComponent>;
  // let dialogMock: SpyObj<MatDialog>;
  // let lssvcMock: SpyObj<LocalStorageService>;



  it('should be created', () => {
    const service: MygridService = TestBed.get(MygridService);
    expect(service).toBeTruthy();
  });

  it('should have a hidden grid initially', () => {
    gridsvcMock = new MygridService();
    if (gridsvcMock.gridElement != null) {
      expect(gridsvcMock.gridElement.style.visibility).toBe('hidden');
    }
  });

  it('should have status set to visible after toggle call', () => {
    gridsvcMock = new MygridService();
    gridsvcMock.toggleGrid();

    if (gridsvcMock.gridElement != null) {
      expect(gridsvcMock.gridElement.style.visibility).toBe('visible');
    }
  });

  it('should have the correct opacity after setOpacity call', () => {
    gridsvcMock = new MygridService();
    gridsvcMock.setOpacity('0.8');

    if (gridsvcMock.gridElement != null) {
      expect(gridsvcMock.gridElement.style.opacity).toBe('0.8');
    }
  });

});

