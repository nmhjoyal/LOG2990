import { ToolAbstract } from './tool-abstract';
import { TestBed } from '@angular/core/testing';

class TestTool extends ToolAbstract {

  constructor(){
    super();
  }

  ngOnInit(): void {
    //empty body
  }  
  
  ngOnDestroy(): void {
    // empty body
  }

  
}

describe('ToolAbstract', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should create an instance', () => {
    expect(new TestTool()).toBeTruthy();
  });
});
