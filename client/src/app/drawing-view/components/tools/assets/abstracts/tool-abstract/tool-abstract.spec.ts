import { ToolAbstract } from './tool-abstract';
import { TestBed } from '@angular/core/testing';
import { ColorService } from 'src/app/services/color_service/color.service';
import { AttributesService } from '../../attributes/attributes.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';

class TestTool extends ToolAbstract {

  constructor(toolService: ToolHandlerService, attributesService: AttributesService, colorService: ColorService){
    super(toolService, attributesService, colorService);
  }

  ngOnInit(): void {
    //empty body
  }  
  
  ngOnDestroy(): void {
    // empty body
  }

  
}

describe('ToolAbstract', () => {
  const mockColorService: jasmine.SpyObj<ColorService> = jasmine.createSpyObj('ColorService', ['']);
  const mockAttributeService: jasmine.SpyObj<AttributesService> = jasmine.createSpyObj('AttributesService', ['']);
  const mockToolHandlerService: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should create an instance', () => {
    expect(new TestTool(mockToolHandlerService, mockAttributeService, mockColorService)).toBeTruthy();
  });
});
