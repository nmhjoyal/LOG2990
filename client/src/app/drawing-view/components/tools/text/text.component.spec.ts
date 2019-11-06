import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ClickTypes } from 'src/AppConstants/ClickTypes';
import { AttributesService } from '../assets/attributes/attributes.service';
import { Alignments, AlignmentType, FontFamilies, TextConstants } from '../assets/constants/text-constants';
import { TextComponent } from './text.component';

describe('TextComponent', () => {
    let textComponent: TextComponent;
    let attrService: AttributesService;
    let fixture: ComponentFixture<TextComponent>;
    let toolServiceMock: ToolHandlerService;
    let attributesServiceMock: AttributesService;
    let colourServiceMock: ColorService;

    beforeEach((() => {
        attributesServiceMock = new AttributesService();
        colourServiceMock = new ColorService();
        toolServiceMock = new ToolHandlerService(colourServiceMock);
        TestBed.configureTestingModule({
            imports: [BrowserDynamicTestingModule],
            declarations: [TextComponent],
            providers: [
            { provide: ToolHandlerService, useValue: toolServiceMock, },
            { provide: AttributesService, useValue: attributesServiceMock, },
            { provide: ColorService, useValue: colourServiceMock, },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TextComponent);
        attrService = TestBed.get(AttributesService);
        textComponent = fixture.componentInstance;
        fixture.detectChanges();
    }));

    afterEach(() => {
        fixture.destroy();
        attrService.resetSavedAttributes();
    });

    it('should create', () => {
        expect(textComponent).toBeTruthy();
    });

    it('should create with previously saved attributes', () => {
        expect(textComponent.text.fontSize).toEqual(TextConstants.DEFAULT_FONT_SIZE);
        expect(textComponent.text.fontFamily).toEqual(FontFamilies.ARIAL);
        expect(textComponent.text.italic).toEqual('');
        expect(textComponent.text.bold).toEqual('');
        attributesServiceMock.textAttributes.wasSaved = true;
        attributesServiceMock.textAttributes.savedFontSize = TextConstants.MAX_FONT_SIZE;
        attributesServiceMock.textAttributes.savedFontFamily = FontFamilies.CAMBRIA;
        attributesServiceMock.textAttributes.savedItalic = TextConstants.ITALIC;
        attributesServiceMock.textAttributes.savedBold = TextConstants.BOLD;
        textComponent.ngOnInit();
        expect(textComponent.text.fontSize).toEqual(TextConstants.MAX_FONT_SIZE);
        expect(textComponent.text.fontFamily).toEqual(FontFamilies.CAMBRIA);
        expect(textComponent.text.italic).toEqual(TextConstants.ITALIC);
        expect(textComponent.text.bold).toEqual(TextConstants.BOLD);
    });

    it('#onLeftClick should be called when left or right mouse button is pressed', () => {
        const spy = spyOn(textComponent, 'onLeftClick');
        const leftClick = new MouseEvent('click', { button: ClickTypes.LEFT_CLICK });
        fixture.debugElement.triggerEventHandler('click', leftClick);
        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyDown should be called when key pressed', () => {
        const spy = spyOn(textComponent, 'onKeyDown');
        const keydown = new KeyboardEvent('keydown', { key: 'a'});
        fixture.debugElement.triggerEventHandler('keydown', keydown);
        expect(spy).toHaveBeenCalled();
    });

    it('first click should create new text box', () => {
        expect(textComponent.isFirstClick).toBe(true);
        const leftClick = new MouseEvent('click', { button: ClickTypes.LEFT_CLICK });
        fixture.debugElement.triggerEventHandler('click', leftClick);
        expect(textComponent.isFirstClick).toBe(false);
    });

    it('click outside of box should save text to drawings only if lines contain text', () => {
        spyOn(ClickHelper, 'cursorInsideObject').and.returnValue(false);
        expect(textComponent.isFirstClick).toBe(true);
        let leftClick = new MouseEvent('click', { button: ClickTypes.LEFT_CLICK });
        fixture.debugElement.triggerEventHandler('click', leftClick);
        expect(textComponent.isFirstClick).toBe(false);
        const keydown = new KeyboardEvent('keydown', { key: 'a'});
        fixture.debugElement.triggerEventHandler('keydown', keydown);
        leftClick = new MouseEvent('click', { button: ClickTypes.LEFT_CLICK });
        fixture.debugElement.triggerEventHandler('click', leftClick);
        expect(toolServiceMock.drawings.length).toEqual(1);

        leftClick = new MouseEvent('click', { button: ClickTypes.LEFT_CLICK });
        fixture.debugElement.triggerEventHandler('click', leftClick);
        leftClick = new MouseEvent('click', { button: ClickTypes.LEFT_CLICK });
        fixture.debugElement.triggerEventHandler('click', leftClick);
        expect(toolServiceMock.drawings.length).toEqual(1);
    });

    it('click inside of text box should not save text to drawings', () => {
        spyOn(ClickHelper, 'cursorInsideObject').and.returnValue(true);
        expect(textComponent.isFirstClick).toBe(true);
        let leftClick = new MouseEvent('click', { button: ClickTypes.LEFT_CLICK });
        fixture.debugElement.triggerEventHandler('click', leftClick);
        expect(textComponent.isFirstClick).toBe(false);
        const keydown = new KeyboardEvent('keydown', { key: 'a'});
        fixture.debugElement.triggerEventHandler('keydown', keydown);
        leftClick = new MouseEvent('click', { button: ClickTypes.LEFT_CLICK });
        fixture.debugElement.triggerEventHandler('click', leftClick);
        expect(toolServiceMock.drawings.length).toEqual(0);
    });

    it('should create new line and pop to previous on backspace', () => {
        const leftClick = new MouseEvent('click', { button: ClickTypes.LEFT_CLICK });
        fixture.debugElement.triggerEventHandler('click', leftClick);
        expect(textComponent.isFirstClick).toBe(false);
        expect(textComponent.text.lines.length).toEqual(1);
        expect(textComponent.currentLine).toEqual(0);
        let keydown = new KeyboardEvent('keydown', { key: 'a'});
        fixture.debugElement.triggerEventHandler('keydown', keydown);
        expect(textComponent.text.lines.length).toEqual(1);
        expect(textComponent.currentLine).toEqual(0);
        keydown = new KeyboardEvent('keydown', { key: 'Enter'});
        fixture.debugElement.triggerEventHandler('keydown', keydown);
        expect(textComponent.text.lines.length).toEqual(2);
        expect(textComponent.currentLine).toEqual(1);
        keydown = new KeyboardEvent('keydown', { key: 'Backspace'});
        fixture.debugElement.triggerEventHandler('keydown', keydown);
        fixture.debugElement.triggerEventHandler('keydown', keydown);
        fixture.debugElement.triggerEventHandler('keydown', keydown);
        expect(textComponent.text.lines.length).toEqual(1);
        expect(textComponent.currentLine).toEqual(0);
    });

    it('should count multiple spaces as 1', () => {
        const leftClick = new MouseEvent('click', { button: ClickTypes.LEFT_CLICK });
        fixture.debugElement.triggerEventHandler('click', leftClick);
        let keydown = new KeyboardEvent('keydown', { key: 'a'});
        fixture.debugElement.triggerEventHandler('keydown', keydown);
        keydown = new KeyboardEvent('keydown', { key: 'Delete'});
        fixture.debugElement.triggerEventHandler('keydown', keydown);
        keydown = new KeyboardEvent('keydown', { key: ' '});
        fixture.debugElement.triggerEventHandler('keydown', keydown);
        fixture.debugElement.triggerEventHandler('keydown', keydown);
        expect(textComponent.text.lines[textComponent.currentLine]).toEqual('a ');
    });

    it('should change the alignment when alignText called', () => {
        // tslint:disable: no-any
        expect(textComponent.text.align).toEqual(Alignments.START);
        (textComponent as any).alignText(AlignmentType.CENTER);
        expect(textComponent.text.align).toEqual(Alignments.CENTER);
        (textComponent as any).alignText(AlignmentType.RIGHT);
        expect(textComponent.text.align).toEqual(Alignments.END);
        (textComponent as any).alignText(AlignmentType.LEFT);
        expect(textComponent.text.align).toEqual(Alignments.START);
        (textComponent as any).alignText(0 - 1);
    });

    it('should make text italic when toItalic called', () => {
        expect(textComponent.text.italic).toEqual('');
        (textComponent as any).toItalic();
        expect(textComponent.text.italic).toEqual(TextConstants.ITALIC);
        (textComponent as any).toItalic();
        expect(textComponent.text.italic).toEqual('');
    });

    it('should make text bold when toBold called', () => {
        expect(textComponent.text.bold).toEqual('');
        (textComponent as any).toBold();
        expect(textComponent.text.bold).toEqual(TextConstants.BOLD);
        (textComponent as any).toBold();
        expect(textComponent.text.bold).toEqual('');
    });

    it('should increment/decrement fontSize when increase/decreaseFontSize called', () => {
        expect(textComponent.text.fontSize).toEqual(TextConstants.DEFAULT_FONT_SIZE);
        (textComponent as any).increaseFontSize();
        expect(textComponent.text.fontSize).toEqual(TextConstants.DEFAULT_FONT_SIZE + 1);
        (textComponent as any).decreaseFontSize();
        expect(textComponent.text.fontSize).toEqual(TextConstants.DEFAULT_FONT_SIZE);
        textComponent.text.fontSize = TextConstants.MAX_FONT_SIZE;
        (textComponent as any).increaseFontSize();
        expect(textComponent.text.fontSize).toEqual(TextConstants.MAX_FONT_SIZE);
        textComponent.text.fontSize = TextConstants.MIN_FONT_SIZE;
        (textComponent as any).decreaseFontSize();
        expect(textComponent.text.fontSize).toEqual(TextConstants.MIN_FONT_SIZE);
        // tslint:enable: no-any
    });
});
