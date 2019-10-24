import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatButtonModule, MatDialogModule, MatDialogRef, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { IndexService } from 'src/app/services/index/index.service';
import { ITag } from '../../../../../../../common/drawing-information/ITag';
import { SaveWindowComponent } from './save-window.component';

describe('SaveWindowComponent', () => {
  let component: SaveWindowComponent;
  let fixture: ComponentFixture<SaveWindowComponent>;
  const indexMock: SpyObj<IndexService> = jasmine.createSpyObj('IndexService', ['getTags', 'saveTag']);

  beforeEach(async(() => {
    indexMock.getTags.and.callFake(() => new Observable<ITag[]>());
    TestBed.configureTestingModule({
      declarations: [SaveWindowComponent],
      imports: [
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatButtonModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: IndexService, useValue: indexMock },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
