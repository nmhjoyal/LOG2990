
import { ToolAbstract } from './tool-abstract';

describe('ToolAbstract', () => {
  let instance: ToolAbstract;

  beforeEach(() => {
    instance = new ToolAbstract();
  });

  it('should create an instance of the derived class', () => {
    expect(instance).toBeTruthy();
  });

});
