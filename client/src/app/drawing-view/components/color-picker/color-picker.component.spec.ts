import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventEmitter } from 'events';
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
            EventEmitter,
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

    it('should have default alpha = 1', () => {
        expect(component.alpha[0]).toEqual('1');
        expect(component.alpha[1]).toEqual('1');
    });

    it('should have primary color = white', () => {
        expect(component.color[0]).toEqual('#ffffffff');
    });

    it('should have primary color = black', () => {
        expect(component.color[0]).toEqual('#000000ff');
    });

    it('should have last 10 colors be of length 10', () => {
        expect(component.colors.length).toEqual(10);
    });

    it('should switch primary color with secondary color ', () => {
        expect(component.switchColors).toBe(component.color[0]);
    });

    it('should have last 10 colors be of length 10', () => {
        expect(component.switchColors).toBe(component.color);
    });

});
