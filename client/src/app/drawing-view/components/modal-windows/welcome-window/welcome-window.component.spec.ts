// tslint:disable: no-string-literal

import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage-service';
import { IModalData } from '../modal-window/IModalData';
import { ModalWindowComponent } from '../modal-window/modal-window.component';
import { WelcomeWindowComponent } from './welcome-window.component';

export interface IWelcomeWindowDataMock extends IModalData {
  storage: SpyObj<LocalStorageService>;
}

describe('WelcomeWindowComponent', () => {
  let component: WelcomeWindowComponent;
  let fixture: ComponentFixture<WelcomeWindowComponent>;
  let mockData: IWelcomeWindowDataMock;

  const dialogMock = {
    close: () => {
      return;
    },
  };

  beforeEach(async(() => {
    mockData = {
      storage: jasmine.createSpyObj('LocalStorageService', ['getShowAgain', 'setShowAgain']),
    };
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
        LocalStorageService,
      ],
    })
      .overrideComponent(WelcomeWindowComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
    fixture = TestBed.createComponent(WelcomeWindowComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the property if the checkbox is clicked', fakeAsync(() => {
    const checkbox = fixture.debugElement.query(By.css('#chbx-showAgain')).nativeElement;
    fixture.detectChanges();
    checkbox.click();
    tick();
    fixture.detectChanges();
    expect(component['isChecked']).toEqual(true);
    checkbox.click();
    tick();
    fixture.detectChanges();
    expect(component['isChecked']).toEqual(false);
  }));

  it('should update local storage when checkbox clicked', () => {
    component.reverseCheckboxClicked();
    component.onClose();
    expect(mockData.storage.setShowAgain).toHaveBeenCalled();
  });

  it('should not update local storage when checkbox not clicked', () => {
    component.onClose();
    expect(mockData.storage.setShowAgain).not.toHaveBeenCalled();
  });

});
