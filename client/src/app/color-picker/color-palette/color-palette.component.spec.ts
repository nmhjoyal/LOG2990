import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPaletteComponent } from './color-palette.component';
import { Component, ViewChild, ElementRef, Input, Output, HostListener } from '@angular/core';
import { EventEmitter } from 'events';

describe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        imports: [
            Component,
            ViewChild,
            ElementRef,
            Input,
            Output,
            EventEmitter,
            HostListener
        ],
        declarations: [
            ColorPaletteComponent,
        ],
        providers: [
            { provide: MatDialogRef, useValue: {} },
            { provide: MAT_DIALOG_DATA, useValue: [] },
        ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPaletteComponent);
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

    it('should define canvas', () => {
        expect(component.canvas).toBeDefined();
    });

    it('should have last 10 colors be of length 10', () => {
        expect(component.colors.length).toEqual(10);
    });

});
