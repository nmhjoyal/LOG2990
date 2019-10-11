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
                                '#ffffffff', '#ffffffff', '#ffffffff', '#ffffffff'];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should define canvas', () => {
        expect(component.canvas).toBeDefined();
    });

    // TODO: fix
    it('should call draw() on mouse move', () => {
        spyOn(component, 'draw').and.callFake(() => {
            return;
        });
        // expect(component.lastColors.length).toEqual(9);
        fixture.debugElement.triggerEventHandler('mousemove', {x: 50, y: 50});
        // expect(component.lastColors.length).toEqual(10);
        expect(component.draw).toHaveBeenCalled();
    });

    // TODO: fix
    it('should call emitColor() on mouse down', () => {
        spyOn(component, 'emitColor').and.callFake(() => {
            return;
        });
        // expect(component.lastColors.length).toEqual(9);
        fixture.debugElement.triggerEventHandler('mousedown', {x: 50, y: 50});
        // expect(component.lastColors.length).toEqual(10);
        expect(component.emitColor).toHaveBeenCalled();
    });

    it('should change color on click of palette', () => {
        expect(component.color[0]).toBeDefined('setColor()');
    });

    // TODO: fix
    it('return color at position', () => {
        expect(component.getColorAtPosition(50, 50)).toEqual('#ffffffff');
    });
});
