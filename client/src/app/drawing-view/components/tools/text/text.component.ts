import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ToolAbstract } from '../assets/abstracts/tool-abstract/tool-abstract';
import { AttributesService } from '../assets/attributes/attributes.service';
import { Alignments, AlignmentType, FontFamilies, TextConstants } from '../assets/constants/text-constants';
import { Id, ToolConstants } from '../assets/constants/tool-constants';
import { IText } from '../assets/interfaces/text-interface';

@Component({
  selector: 'app-tools-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent extends ToolAbstract implements OnInit, OnDestroy {

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  text: IText;
  isFirstClick: boolean;
  currentLine: number;
  fontFamilySelection: string;
  maxWidth: number;
  initialX: number;

  constructor(protected toolServiceRef: ToolHandlerService, protected attributesServiceRef: AttributesService,
    protected colorServiceRef: ColorService) {
    super();
    this.text = {
      id: Id.TEXT,
      lines: [''],
      fontSize: TextConstants.DEFAULT_FONT_SIZE,
      italic: '',
      bold: '',
      align: Alignments.START,
      fontFamily: FontFamilies.ARIAL,
      primaryColour: colorServiceRef.color[ToolConstants.PRIMARY_COLOUR_INDEX],
      x: ToolConstants.NULL,
      y: ToolConstants.NULL,
      width: 0,
      height: 0,
    };
    this.resetText();
  }

  ngOnInit(): void {
    if (this.attributesServiceRef.textAttributes.wasSaved) {
      this.text.lines = this.attributesServiceRef.textAttributes.savedText;
      this.text.fontSize = this.attributesServiceRef.textAttributes.savedFontSize;
      this.text.italic = this.attributesServiceRef.textAttributes.savedItalic;
      this.text.bold = this.attributesServiceRef.textAttributes.savedBold;
      this.text.fontFamily = this.attributesServiceRef.textAttributes.savedFontFamily;
      this.text.primaryColour = this.attributesServiceRef.textAttributes.savedPrimaryColour;
    }
  }

  ngOnDestroy(): void {
    this.attributesServiceRef.textAttributes.savedText = this.text.lines;
    this.attributesServiceRef.textAttributes.savedFontSize = this.text.fontSize;
    this.attributesServiceRef.textAttributes.savedItalic = this.text.italic;
    this.attributesServiceRef.textAttributes.savedBold = this.text.bold;
    this.attributesServiceRef.textAttributes.savedFontFamily = this.text.fontFamily;
    this.attributesServiceRef.textAttributes.savedPrimaryColour = this.text.primaryColour;
    this.attributesServiceRef.textAttributes.wasSaved = true;
    this.saveText();
  }

  @HostListener('click', ['$event']) onLeftClick(event: MouseEvent): void {
    if (this.isFirstClick) {
      this.text.x = ClickHelper.getXPosition(event);
      this.text.y = ClickHelper.getYPosition(event);
      this.initialX = this.text.x;
      this.maxWidth = 1;
      this.text.height = this.text.fontSize;
      this.isFirstClick = false;
      return;
    }
    this.text.width = this.maxWidth;
    if (!ClickHelper.cursorInsideObject(this.text, ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))) {
      this.saveText();
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.text.lines.push('');
      this.text.height += this.text.fontSize;
      this.currentLine++;
      this.text.width = 0;
    } else if (event.key === 'Backspace') {
      if (this.currentLine >= 0 && this.text.lines[this.currentLine].length - 1 >= 0) {
        this.text.lines[this.currentLine] = this.text.lines[this.currentLine].slice(0, this.text.lines[this.currentLine].length - 1);
        if (this.maxWidth === this.text.width) {
          this.maxWidth -= this.pointsToPixels(this.text.fontSize) * (1 - this.getAspectRatio(this.fontFamilySelection));
        }
        this.text.width -= this.pointsToPixels(this.text.fontSize) * (1 - this.getAspectRatio(this.fontFamilySelection));
      } else {
        if (this.currentLine !== 0) {
          this.text.lines.pop();
          this.text.height -= this.text.fontSize;
          this.currentLine--;
          this.text.width = this.text.lines[this.currentLine].length *
            (this.pointsToPixels(this.text.fontSize) * (1 - this.getAspectRatio(this.fontFamilySelection)));
          this.updateMaxWidth();
        }
      }
    } else if (event.key.length < 2) {
      this.text.lines[this.currentLine] += event.key;
      this.text.width += this.text.fontSize * (this.getAspectRatio(this.fontFamilySelection));
      if (this.text.width > this.maxWidth) {
        this.maxWidth = this.text.width;
      }
    }
  }

  protected decreaseFontSize(): void {
    if (this.text.fontSize - 1 > TextConstants.MIN_FONT_SIZE) {
      this.text.fontSize--;
      this.updateMaxWidth();
    }
  }

  protected increaseFontSize(): void {
    if (this.text.fontSize + 1 < TextConstants.MAX_FONT_SIZE) {
      this.text.fontSize++;
      this.updateMaxWidth();
    }
  }

  protected toItalic(): void {
    this.text.italic = this.text.italic.includes(TextConstants.ITALIC) ? '' : TextConstants.ITALIC;
  }

  protected toBold(): void {
    this.text.bold = this.text.bold.includes(TextConstants.BOLD) ? '' : TextConstants.BOLD;
  }

  protected alignText(alignIndex: AlignmentType): void {
    switch (alignIndex) {
      case AlignmentType.LEFT:
        this.text.align = Alignments.START;
        this.text.x = this.initialX;
        break;
      case AlignmentType.CENTER:
        this.text.align = Alignments.CENTER;
        this.text.x = this.initialX + (this.maxWidth / 2);
        break;
      case AlignmentType.RIGHT:
        this.text.align = Alignments.END;
        this.text.x = this.initialX + this.maxWidth;
        break;
    }
  }

  protected getAspectRatio(fontFamily: string): number {
    switch (fontFamily) {
      case FontFamilies.ARIAL: case FontFamilies.IMPACT:
      case FontFamilies.FRANKLIN_GOTHIC: case FontFamilies.TREBUCHET_MS:
        // tslint:disable: no-magic-numbers
        return 0.52;
      case FontFamilies.COURIER_NEW:
        return 0.42;
      case FontFamilies.GEORGIA: case FontFamilies.CAMBRIA:
        return 0.48;
      case FontFamilies.GILL_SANS:
        return 0.47;
      case FontFamilies.LUCINDA_SANS: case FontFamilies.SEGOE_UI: case FontFamilies.VERDANA:
        return 0.58;
      case FontFamilies.TIMES_NEW_ROMAN: case FontFamilies.CURSIVE:
        return 0.45;
      default:
        return 0.52;
      // tslint:enable: no-magic-numbers
    }
  }

  protected updateMaxWidth(): void {
    this.maxWidth = 0;
    for (const line of this.text.lines) {
      const width = line.length * (this.pointsToPixels(this.text.fontSize) * (1 - this.getAspectRatio(this.fontFamilySelection)));
      this.maxWidth = width > this.maxWidth ? width : this.maxWidth;
    }
    this.text.height = this.pointsToPixels(this.text.fontSize) * this.text.lines.length;
  }

  protected saveText(): void {
    if (this.text.lines.length > 0) {
      const createdText: IText = {
        id: this.text.id,
        lines: this.text.lines,
        fontSize: this.text.fontSize,
        italic: this.text.italic,
        bold: this.text.bold,
        align: this.text.align,
        fontFamily: this.fontFamilySelection,
        primaryColour: this.text.primaryColour,
        x: this.text.x,
        y: this.text.y,
        width: this.maxWidth,
        height: this.text.height,
      };
      this.toolServiceRef.drawings.push(createdText);
      this.resetText();
    }
  }

  protected resetText(): void {
    this.isFirstClick = true;
    this.maxWidth = 0;
    this.initialX = 0;
    this.currentLine = 0;
    this.text.lines = [''];
    this.text.width = 0;
    this.fontFamilySelection = FontFamilies.ARIAL;
  }

  protected pointsToPixels(points: number): number {
    // tslint:disable: no-magic-numbers
    switch (points) {
      case 6: case 7:
        return points + 2;
      case 8: case 9: case 10:
        return points + 3;
      case 11: case 12: case 13:
        return points + 4;
      case 14:
        return points + 5;
      case 15: case 16: case 17: case 18: case 19: case 20: case 21:
        return points + 6;
      case 22: case 23:
        return points + 7;
      case 24: case 25:
        return points + 8;
      case 26: case 27: case 28: case 29:
        return points + 9;
      case 30: case 31: case 32: case 33:
        return points + 10;
      case 34: case 35:
          return points + 11;
      case 36:
        return points + 12;
    }
    return points;
    // tslint:enable: no-magic-numbers
  }
}
