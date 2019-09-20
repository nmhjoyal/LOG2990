import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWindowComponent } from './modal-window.component';
// import { MatDialog, MatDialogRef } from '@angular/material';

describe('ModalWindowComponent', () => {
  let component: ModalWindowComponent;
  let fixture: ComponentFixture<ModalWindowComponent>;
  // let dialog: MatDialog;
  var spyEvent = spyOnEvent()

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalWindowComponent],
    })
      .compileComponents();
      
      // dialog = TestBed.get(MatDialog);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  beforeEach(function () {
    this.$document.triggerHandler('click.sortColumnList');
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should have a defined dialogRef', () => {
  //   fixture = TestBed.createComponent(ModalWindowComponent);
  //   component = fixture.componentInstance;
  //   expect(component.dialogRef).toBeTruthy();
  // });

  // // it('should have window title `test window`', () => {
  // //   fixture = TestBed.createComponent(ModalWindowComponent);
  // //   component = fixture.componentInstance;
  // //   component.data.title = 'testing';
  // //   expect(component.data.title).toEqual('testing');
  // // });

  // it('should close the dialog and receive the message', () => {
  //   fixture = TestBed.createComponent(ModalWindowComponent);
  //   component = fixture.componentInstance;
  //   const config = {
  //     data: {
  //       title: 'test window',
  //     }
  //   }
  //   dialog.open

  // })

});
