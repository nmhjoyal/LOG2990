import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PinceauComponent } from './pinceau.component';
//import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';




describe('PinceauComponent', () => {
  let component: PinceauComponent;
  let fixture: ComponentFixture<PinceauComponent>;
  //let toolServiceMock: jasmine.SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinceauComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinceauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //component[""]
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
