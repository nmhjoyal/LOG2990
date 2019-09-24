import { HttpClientModule } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatCheckboxModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import SpyObj = jasmine.SpyObj;
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { IndexService } from '../../services/index/index.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let indexServiceSpy: SpyObj<IndexService>;

  beforeEach(() => {
    indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet']);
    indexServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HttpClientModule,
        MatListModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatButtonModule,
        MatSidenavModule,
        MatDialogModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        AppComponent,
      ],
      providers: [
        { provide: IndexService, useValue: indexServiceSpy },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
    }).compileComponents();
  }));
});
