import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewDrawingWindowComponent } from './new-drawing-window.component';

describe('NewDrawingWindowComponent', () => {
  let component: NewDrawingWindowComponent;
  let fixture: ComponentFixture<NewDrawingWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        NewDrawingWindowComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawingWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have as page title `Create a new drawing`', () => {
    expect(component.data.title).toEqual('Create a new drawing');
  });

  it('should have default width equal to window inner width', () => {
    const window = new Window();
    expect(component.data.drawingWidth).toEqual(window.innerWidth);
  });

  it('should have default height equal to window inner height', () => {
    const window = new Window();
    expect(component.data.drawingHeight).toEqual(window.innerHeight);
  });

});
