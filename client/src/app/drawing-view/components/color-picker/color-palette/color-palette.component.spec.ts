import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, ElementRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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

    it('should have default alpha = 1', () => {
        expect(component.alpha[0]).toEqual(1);
        expect(component.alpha[1]).toEqual(1);
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
        expect(component.lastColors.length).toEqual(10);
    });

    it('should change Color on click of palette', () => {
        expect(component.alpha[0]).toBeDefined('setAlpha()');
    });
});
