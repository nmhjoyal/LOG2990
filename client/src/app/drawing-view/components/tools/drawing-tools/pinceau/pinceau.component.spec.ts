    // tslint:disable: no-string-literal
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingViewModule } from 'src/app/drawing-view/drawing-view.module';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';

import { ToolConstants } from '../../assets/tool-constants';
import { DrawingToolsAbstract } from '../drawing-tools-abstract';
import { PinceauComponent } from './pinceau.component';

class AbstractSpy extends DrawingToolsAbstract {
  saveAttribute() {
    this.drawingToolService.paintbrushStrokeWidth = this.stroke.strokeWidth;
    this.drawingToolService.paintbrushFilter = this.stroke.filter;
  }

}

describe('PinceauComponent', () => {
  let component: PinceauComponent;
  let fixture: ComponentFixture<PinceauComponent>;
  let toolSpy: ToolHandlerService;
  let abstractSpy: AbstractSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        DrawingViewModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach( async () => {
    fixture = TestBed.createComponent(PinceauComponent);
    toolSpy = new ToolHandlerService();
    component = new PinceauComponent(toolSpy);
    fixture.detectChanges();
    abstractSpy = new AbstractSpy(toolSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save the attribute when the component is destroyed', () => {
    const spy = spyOn(component, 'saveAttribute');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should properly save the attributes', () => {
    abstractSpy['stroke'].strokeWidth = 3;
    abstractSpy['stroke'].filter = ToolConstants.FILTER_ID.FILTER1;
    abstractSpy.saveAttribute();
    expect(toolSpy.paintbrushStrokeWidth).toEqual(abstractSpy['stroke'].strokeWidth);
    expect(toolSpy.paintbrushFilter).toEqual(abstractSpy['stroke'].filter);
  });

  it('should set no filter for the first case', () => {
    component.setFilter(0);
    component.saveAttribute();
    expect(toolSpy.paintbrushFilter).toEqual(ToolConstants.FILTER_ID.FILTER1);
  });

  it('should set the appropriate filter for the second case', () => {
    component.setFilter(1);
    component.saveAttribute();
    expect(toolSpy.paintbrushFilter).toEqual(ToolConstants.FILTER_ID.FILTER2);
  });

  it('should set the appropriate filter for the third case', () => {
    component.setFilter(2);
    component.saveAttribute();
    expect(toolSpy.paintbrushFilter).toEqual(ToolConstants.FILTER_ID.FILTER3);
  });

  it('should set the appropriate filter for the fourth case', () => {
    component.setFilter(3);
    component.saveAttribute();
    expect(toolSpy.paintbrushFilter).toEqual(ToolConstants.FILTER_ID.FILTER4);
  });

  it('should set the appropriate filter for the fifth case', () => {
    component.setFilter(4);
    component.saveAttribute();
    expect(toolSpy.paintbrushFilter).toEqual(ToolConstants.FILTER_ID.FILTER5);
  });

  it('should default to no filter', () => {
    component.setFilter(10);
    component.saveAttribute();
    expect(toolSpy.paintbrushFilter).toEqual(ToolConstants.FILTER_ID.FILTER1);
  });

});
