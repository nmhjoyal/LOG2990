import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, ElementRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventEmitter } from 'events';
import { ColorPaletteComponent } from './color-palette.component';

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
            HostListener,
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

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should define canvas', () => {
        expect(component.canvas).toBeDefined();
    });

    it('should call draw() on mouse move', () => {
        expect(component.lastColors.length).toEqual(10);
        expect(component.draw()).toHaveBeenCalled();
    });

    it('should change Color on click of palette', () => {
        expect(component.alpha[0]).toBeDefined('setAlpha()');
    });
});
