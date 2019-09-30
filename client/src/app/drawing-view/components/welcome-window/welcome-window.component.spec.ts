import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { WelcomeWindowComponent } from './welcome-window.component';

describe('WelcomeWindowComponent', () => {
  let component: WelcomeWindowComponent;
  let fixture: ComponentFixture<WelcomeWindowComponent>;
  const mockLocalStorage = jasmine.createSpyObj('LocalStorageService',  ['getShowAgain', 'setShowAgain']);
  const mockData = {
    storage: jasmine.createSpyObj('LocalStorageService',  ['getShowAgain', 'setShowAgain']),
  };

  const dialogMock = {
    close: () => {
      console.log('MockDialog close');
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        ModalWindowComponent,
        WelcomeWindowComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: LocalStorageService, useValue: mockLocalStorage },
      ],
    })
    .overrideComponent(WelcomeWindowComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the property if the checkbox is clicked', async(() => {
    const checkbox = fixture.debugElement.query(By.css('#chbx-showAgain')).nativeElement;
    checkbox.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.isChecked).toEqual(true);
    });
  }));

  it('should update local storage when checkbox clicked', () => {
    component.isChecked = true;
    component.onCloseClick();
    expect(mockData.storage.setShowAgain).toHaveBeenCalled();
  });
});
