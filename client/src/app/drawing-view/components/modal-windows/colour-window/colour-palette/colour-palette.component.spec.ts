import { HttpClientModule } from '@angular/common/http';
import { DebugElement, ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Strings } from 'src/AppConstants/Strings';
import { ColourConstants, Rainbow } from '../../../tools/assets/constants/colour-constants';
import { ColourPaletteComponent } from './colour-palette.component';
// tslint:disable: no-any
// tslint:disable: no-string-literal

describe('ColourPaletteComponent', () => {
    let component: ColourPaletteComponent;
    let fixture: ComponentFixture<ColourPaletteComponent>;
    let hostElement: DebugElement;

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
                ColourPaletteComponent,
            ],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: [] },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColourPaletteComponent);
        component = fixture.componentInstance;
        component['lastColours'] = [Strings.WHITE_HEX, Strings.WHITE_HEX, Strings.WHITE_HEX, Strings.WHITE_HEX, Strings.WHITE_HEX,
        Strings.WHITE_HEX, Strings.WHITE_HEX, Strings.WHITE_HEX, Strings.WHITE_HEX, Strings.WHITE_HEX];
        fixture.detectChanges();
        hostElement = fixture.debugElement;
    });

    it('should be initalized with correct attributes', () => {
        expect(component).toBeTruthy();
        expect(component.colour).toBeDefined();
        expect(component['primaryColour']).toBeDefined();
        expect(component['secondaryColour']).toBeDefined();
        expect((component as any).mousedown).toEqual(false);
    });

    it('should call all functions on drawGradient', () => {
        const beginSpy = spyOn((component as any).context, 'beginPath');
        const rectSpy = spyOn((component as any).context, 'rect');
        const fillSpy = spyOn((component as any).context, 'fill');
        const closeSpy = spyOn((component as any).context, 'closePath');
        const width = component['canvas'].nativeElement.width;
        const height = component['canvas'].nativeElement.height;
        const colourGradient = (component as any).context.createLinearGradient(0, 0, 0, height);
        colourGradient.addColorStop(ColourConstants.COLOUR_PALETTE_SEPARATOR, Rainbow.RED);
        component.drawGradient(colourGradient, width, height);
        expect(beginSpy).toHaveBeenCalled();
        expect(rectSpy).toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalled();
    });

    it('#onMouseDown should be called when left mouse button is pressed', () => {
        const spy = spyOn(component, 'onMouseDown');
        const event = new MouseEvent('mousedown');
        hostElement.triggerEventHandler('mousedown', event);
        expect(spy).toHaveBeenCalled();
        // expect(component.draw).toHaveBeenCalled();
    });

    it('#onMouseMove should be called when left mouse button gets pressed', () => {
        const spy = spyOn(component, 'onMouseMove');
        const event = new MouseEvent('mousemove');
        hostElement.triggerEventHandler('mousemove', event);
        expect(spy).toHaveBeenCalled();
        // expect(component.emitColour).toHaveBeenCalled();
    });

    it('#onMouseUp should be called when left mouse button gets released', () => {
        const spy = spyOn(component, 'onMouseUp');
        const event = new MouseEvent('mouseup');
        hostElement.triggerEventHandler('mouseup', event);
        expect(spy).toHaveBeenCalled();
    });

    it('#getColourAtPosition should return color', () => {
        component.draw();
        const colour = component.getColourAtPosition(1, 1);
        expect(colour).not.toBeNull();
    });

});