import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPaletteComponent } from './color-palette.component';

describe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        imports: [
            BrowserModule,
            HttpClientModule,
            MatDialogModule,
            FormsModule,
            MatFormFieldModule,
            MatInputModule,
            BrowserAnimationsModule,
            MatButtonModule,
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
        component.lastColors = ['#ffffffff', '#ffffffff', '#ffffffff', '#ffffffff', '#ffffffff',
                                '#ffffffff', '#ffffffff', '#ffffffff', '#ffffffff', '#ffffffff' ];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should define canvas', () => {
        expect(component.canvas).toBeDefined();
    });
/*
    // TODO: fix
    it('should call draw() on mouse move', () => {
        spyOn(component, 'draw');
        fixture.debugElement.triggerEventHandler('mousemove', {x: 50, y: 50});
        fixture.detectChanges();
        expect(component.draw).toHaveBeenCalled();
    });

    // TODO: fix
    it('should call emitColor() on mouse down', () => {
        spyOn(component, 'emitColor').and.callFake(() => {
            return;
        });
        fixture.debugElement.triggerEventHandler('mousedown', {x: 0, y: 0});
        expect(component.emitColor).toHaveBeenCalled();
    });

     // TODO: fix
    it('should return color at position', () => {
        expect(component.getColorAtPosition(0, 0)).toEqual('#ffffffff');
    });
*/
    it('should change color on click of palette', () => {
        expect(component.color[0]).toBeDefined('setColor()');
    });

});
