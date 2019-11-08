import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { Gridservice } from './grid.service';

describe('GridService', () => {
  let service: Gridservice;

  beforeEach(() => {
    service = new Gridservice();
  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();
    expect(service.gridStatus).toEqual(false);
    expect(service.gridOpacity).toEqual(0);
    expect(service.gridSize).toEqual(NumericalValues.DEFAULT_GRID_SIZE);
    expect(service.lastOpacity).toEqual(NumericalValues.DEFAULT_OPACITY);
  });

  it('should decrease rectangle size on #decreaseSize', () => {
    service.decreaseSize();
    expect(service.gridSize).toBeLessThan(NumericalValues.DEFAULT_GRID_SIZE);
  });

  it('should not decrease rectangle size on #decreaseSize when at min', () => {
    service.gridSize = NumericalValues.MIN_GRID_SIZE;
    service.decreaseSize();
    expect(service.gridSize).toEqual(NumericalValues.MIN_GRID_SIZE);
  });

  it('should increase rectangle size on #increaseSize', () => {
    service.increaseSize();
    expect(service.gridSize).toBeGreaterThan(NumericalValues.DEFAULT_GRID_SIZE);
  });

  it('should not increase rectangle size on #increaseSize when at max', () => {
    service.gridSize = NumericalValues.MAX_GRID_SIZE;
    service.increaseSize();
    expect(service.gridSize).toEqual(NumericalValues.MAX_GRID_SIZE);
  });

  it('should put grid visibility to 0 on #toggleGrid when grid is on', () => {
    service.gridStatus = true;
    service.toggleGrid();
    expect(service.gridOpacity).toEqual(0);
  });

  it('should put grid visibility to lastOpacity on #toggleGrid when grid is off', () => {
    service.gridStatus = false;
    service.toggleGrid();
    expect(service.gridSize).toEqual(NumericalValues.DEFAULT_GRID_SIZE);
  });

});
