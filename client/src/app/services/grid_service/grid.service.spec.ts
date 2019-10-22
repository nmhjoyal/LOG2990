import { TestBed } from '@angular/core/testing';
import { GridService } from './grid.service';

describe('MygridService', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  let gridServiceMock: GridService;

  it('should be created', () => {
    const service: GridService = TestBed.get(GridService);
    expect(service).toBeTruthy();
  });

  it('should have a hidden grid initially', () => {
    gridServiceMock = new GridService();
    if (gridServiceMock.gridElement != null) {
      expect(gridServiceMock.gridElement.style.visibility).toBe('hidden');
    }
  });

  it('should have status set to visible after toggle call', () => {
    gridServiceMock = new GridService();
    gridServiceMock.toggleGrid();

    if (gridServiceMock.gridElement != null) {
      expect(gridServiceMock.gridElement.style.visibility).toBe('visible');
    }
  });

  it('should have the correct opacity after setOpacity call', () => {
    gridServiceMock = new GridService();
    gridServiceMock.setOpacity('0.8');

    if (gridServiceMock.gridElement != null) {
      expect(gridServiceMock.gridElement.style.opacity).toBe('0.8');
    }
  });

});

