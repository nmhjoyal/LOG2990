import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ToolAbstract } from '../assets/abstracts/tool-abstract/tool-abstract';
import { AttributesService } from '../assets/attributes/attributes.service';
import { Alignments, AlignmentType, FontFamilies, TextConstants } from '../assets/constants/text-constants';
import { Id, ToolConstants } from '../assets/constants/tool-constants';
import { ITools } from '../assets/interfaces/itools';
import { IText } from '../assets/interfaces/text-interface';

@Component({
  selector: 'app-tools-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent extends ToolAbstract implements OnInit, OnDestroy {

  @Input() windowHeight: number;
  @Input() windowWidth: number;
  @ViewChild('textElement', {static: false}) textElement: ElementRef;

  text: IText;
  isFirstClick: boolean;
  currentLine: number;
  fontFamilySelection: string;
  initialX: number;
  boxX: number;

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
      this.text.fontSize = this.attributesServiceRef.textAttributes.savedFontSize;
      this.text.italic = this.attributesServiceRef.textAttributes.savedItalic;
      this.text.bold = this.attributesServiceRef.textAttributes.savedBold;
      this.text.fontFamily = this.attributesServiceRef.textAttributes.savedFontFamily;
    }
  }

  ngOnDestroy(): void {
    this.updateBoundingBox();
    this.saveText();
    this.attributesServiceRef.textAttributes.savedFontSize = this.text.fontSize;
    this.attributesServiceRef.textAttributes.savedItalic = this.text.italic;
    this.attributesServiceRef.textAttributes.savedBold = this.text.bold;
    this.attributesServiceRef.textAttributes.savedFontFamily = this.text.fontFamily;
    this.attributesServiceRef.textAttributes.wasSaved = true;
  }

  @HostListener('click', ['$event']) onLeftClick(event: MouseEvent): void {
    this.handleLeftClickEvent(event);
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    this.handleKeydownEvent(event);
  }

  protected handleKeydownEvent(event: KeyboardEvent): void {
    if (event.key === TextConstants.ENTER && this.text.lines[this.currentLine].length > 0) {
      this.text.lines.push('');
      this.currentLine++;
    } else if (event.key === TextConstants.BACKSPACE) {
      if (this.currentLine >= 0 && this.text.lines[this.currentLine].length - 1 >= 0) {
        this.text.lines[this.currentLine] = this.text.lines[this.currentLine].slice(0, this.text.lines[this.currentLine].length - 1);
      } else if (this.currentLine > 0) {
        this.text.lines.pop();
        this.currentLine--;
      }
    } else if (event.key.length < 2) {
      if ((event.key === ' ' && this.text.lines[this.currentLine].slice(this.text.lines[this.currentLine].length - 1) !== ' ')
           || event.key !== ' ') {
        this.text.lines[this.currentLine] += event.key;
      }
    }
    this.updateBoundingBox();
  }

  protected handleLeftClickEvent(event: MouseEvent): void {
    if (this.isFirstClick) {
      this.createNewTextBox(event);
      return;
    }
    this.updateBoundingBox();
    const boundingBox: ITools = { id: Id.RECTANGLE,
      x: this.textElement.nativeElement.getBBox().x,
      y: this.textElement.nativeElement.getBBox().y,
      width: this.text.width,
      height: this.text.height};
    if (!ClickHelper.cursorInsideObject(boundingBox, ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))) {
      this.saveText();
      this.createNewTextBox(event);
    }
  }

  protected createNewTextBox(event: MouseEvent): void {
    this.text.x = ClickHelper.getXPosition(event);
    this.text.y = ClickHelper.getYPosition(event);
    this.initialX = this.text.x;
    this.boxX = this.initialX;
    this.text.width = 2;
    this.text.height = this.text.fontSize + TextConstants.HEIGHT_BUFFER;
    this.isFirstClick = false;
  }

  protected decreaseFontSize(): void {
    if (this.text.fontSize - 1 > TextConstants.MIN_FONT_SIZE) {
      this.text.fontSize--;
      this.updateBoundingBox();
    }
  }

  protected increaseFontSize(): void {
    if (this.text.fontSize + 1 < TextConstants.MAX_FONT_SIZE) {
      this.text.fontSize++;
      this.updateBoundingBox();
    }
  }

  protected toItalic(): void {
    this.text.italic = this.text.italic.includes(TextConstants.ITALIC) ? '' : TextConstants.ITALIC;
    this.updateBoundingBox();
  }

  protected toBold(): void {
    this.text.bold = this.text.bold.includes(TextConstants.BOLD) ? '' : TextConstants.BOLD;
    this.updateBoundingBox();
  }

  protected alignText(alignIndex: AlignmentType): void {
    switch (alignIndex) {
      case AlignmentType.LEFT:
        this.text.align = Alignments.START;
        this.text.x = this.initialX;
        break;
      case AlignmentType.CENTER:
        this.text.align = Alignments.CENTER;
        this.text.x = this.initialX + (this.text.width / 2);
        break;
      case AlignmentType.RIGHT:
        this.text.align = Alignments.END;
        this.text.x = this.initialX + this.text.width;
        break;
    }
    this.updateMaxWidthAndHeight();
    this.boxX = this.initialX;
  }

  protected updateBoundingBox(): void {
    this.updateMaxWidthAndHeight();
    this.updateBoxX();
  }

  protected updateMaxWidthAndHeight(): void {
    this.text.width = this.textElement.nativeElement.getBBox().width;
    this.text.height = this.textElement.nativeElement.getBBox().height + TextConstants.HEIGHT_BUFFER;
  }

  protected updateBoxX(): void {
    this.boxX = this.textElement.nativeElement.getBBox().x;
    this.initialX = this.boxX;
  }

  protected saveText(): void {
    if (this.text.lines[0].length > 0) {
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
        width: this.text.width,
        height: this.text.height,
        boxXPosition: this.boxX,
      };
      this.toolServiceRef.drawings.push(createdText);
      this.resetText();
    }
  }

  protected resetText(): void {
    this.isFirstClick = true;
    this.initialX = 0;
    this.boxX = 0;
    this.currentLine = 0;
    this.text.lines = [''];
    this.text.width = 0;
    this.fontFamilySelection = FontFamilies.ARIAL;
  }
}
