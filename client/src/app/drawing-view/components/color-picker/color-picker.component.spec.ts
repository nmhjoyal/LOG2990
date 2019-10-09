import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, ElementRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        imports: [
            Component,
            ViewChild,
            ElementRef,
            Input,
            Output,
            HostListener,
        ],
        declarations: [
            ColorPickerComponent,
        ],
        providers: [
            { provide: MatDialogRef, useValue: {} },
            { provide: MAT_DIALOG_DATA, useValue: [] },
        ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
