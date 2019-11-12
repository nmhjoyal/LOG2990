import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColourPaletteComponent } from './colour-palette/colour-palette.component';
import { ColourPickerComponent } from './colour-picker.component';

describe('ColourPickerComponent', () => {
    let component: ColourPickerComponent;
    let fixture: ComponentFixture<ColourPickerComponent>;

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
            ColourPickerComponent,
            ColourPaletteComponent,
        ],
        providers: [
            { provide: MatDialogRef, useValue: {} },
            { provide: MAT_DIALOG_DATA, useValue: [] },
        ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColourPickerComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});