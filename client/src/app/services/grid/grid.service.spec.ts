import { GridConstants } from '../../drawing-view/components/tools/assets/constants/grid-constants';
import { GridService } from './grid.service';
// tslint:disable: no-any

describe('GridService', () => {
  let service: GridService;

  beforeEach(() => {
    service = new GridService();
  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();
    expect((service as any).gridStatus).toEqual(false);
    expect((service as any).gridOpacity).toEqual(0);
    expect((service as any).gridSize).toEqual(GridConstants.DEFAULT_GRID_SIZE);
    expect((service as any).lastOpacity).toEqual(GridConstants.DEFAULT_OPACITY);
  });

  it('should decrease rectangle size on #decreaseSize', () => {
    service.decreaseSize();
    expect((service as any).gridSize).toBeLessThan(GridConstants.DEFAULT_GRID_SIZE);
  });

  it('should not decrease rectangle size on #decreaseSize when at min', () => {
    (service as any).gridSize = GridConstants.MIN_GRID_SIZE;
    service.decreaseSize();
    expect((service as any).gridSize).toEqual(GridConstants.MIN_GRID_SIZE);
  });

  it('should increase rectangle size on #increaseSize', () => {
    service.increaseSize();
    expect((service as any).gridSize).toBeGreaterThan(GridConstants.DEFAULT_GRID_SIZE);
  });

  it('should not increase rectangle size on #increaseSize when at max', () => {
    (service as any).gridSize = GridConstants.MAX_GRID_SIZE;
    service.increaseSize();
    expect((service as any).gridSize).toEqual(GridConstants.MAX_GRID_SIZE);
  });

  it('should put grid visibility to 0 on #toggleGrid when grid is on', () => {
    (service as any).gridStatus = true;
    service.toggleGrid();
    expect((service as any).gridOpacity).toEqual(0);
  });

  it('should put grid visibility to lastOpacity on #toggleGrid when grid is off', () => {
    (service as any).lastOpacity = 1;
    (service as any).gridStatus = false;
    service.toggleGrid();
    expect((service as any).gridOpacity).toEqual((service as any).lastOpacity);
  });

});
