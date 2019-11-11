import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Strings } from 'src/AppConstants/Strings';
import { ColourPaletteComponent } from './colour-palette.component';

describe('ColourPaletteComponent', () => {
    let component: ColourPaletteComponent;
    let fixture: ComponentFixture<ColourPaletteComponent>;

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
        component.lastColours = [Strings.WHITE_HEX, Strings.WHITE_HEX, Strings.WHITE_HEX, Strings.WHITE_HEX, Strings.WHITE_HEX,
                                Strings.WHITE_HEX, Strings.WHITE_HEX, Strings.WHITE_HEX, Strings.WHITE_HEX, Strings.WHITE_HEX];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should define canvas', () => {
        expect(component.canvas).toBeDefined();
    });

    it('should change colour on click of palette', () => {
        expect(component.colour[0]).toBeDefined('setColour()');
    });

});
