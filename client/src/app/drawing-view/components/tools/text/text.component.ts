import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import ClickHelper from 'src/app/helpers/click-helper/click-helper';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { ToolAbstract } from '../assets/abstracts/tool-abstract/tool-abstract';
import { AttributesService } from '../assets/attributes/attributes.service';
import { IText } from '../assets/interfaces/text-interface';
import { Id, ToolConstants } from '../assets/tool-constants';

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

  constructor(protected toolServiceRef: ToolHandlerService, protected attributesServiceRef: AttributesService,
    protected colorServiceRef: ColorService) {
    super();
    this.text = {
      id: Id.TEXT,
      lines: [''],
      fontSize: 12,
      isItalic: false,
      isBold: false,
      x: ToolConstants.NULL,
      y: ToolConstants.NULL,
      width: 0,
      height: 0,
    };
    this.isFirstClick = true;
    this.currentLine = 0;
  }

  ngOnInit(): void {
    if (this.attributesServiceRef.textAttributes.wasSaved) {
      this.text.lines = this.attributesServiceRef.textAttributes.savedText;
      this.text.fontSize = this.attributesServiceRef.textAttributes.savedFontSize;
      this.text.isItalic = this.attributesServiceRef.textAttributes.savedIsItalic;
      this.text.isBold = this.attributesServiceRef.textAttributes.savedIsBold;
    }
  }

  ngOnDestroy(): void {
    this.attributesServiceRef.textAttributes.savedText = this.text.lines;
    this.attributesServiceRef.textAttributes.savedFontSize = this.text.fontSize;
    this.attributesServiceRef.textAttributes.savedIsBold = this.text.isBold;
    this.attributesServiceRef.textAttributes.savedIsItalic = this.text.isItalic;
    this.attributesServiceRef.textAttributes.wasSaved = true;
  }

  @HostListener('click', ['$event']) onLeftClick(event: MouseEvent): void {
    if (this.isFirstClick) {
      this.text.x = ClickHelper.getXPosition(event);
      this.text.y = ClickHelper.getYPosition(event);
      this.text.height = this.text.fontSize;
      this.text.width = 1;
      this.isFirstClick = false;
      return;
    }
    if (!ClickHelper.cursorInsideObject(this.text, ClickHelper.getXPosition(event), ClickHelper.getYPosition(event))) {
      if (this.text.lines.length > 0) {
        const createdText: IText = {
          id: this.text.id,
          lines: this.text.lines,
          fontSize: 12,
          isItalic: false,
          isBold: false,
          x: this.text.x,
          y: this.text.y,
          width: 0,
          height: 0,
        };
        this.toolServiceRef.drawings.push(createdText);
      }
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.text.lines.push('');
      this.currentLine++;
    } else if (event.key === 'Backspace') {
      if (this.currentLine >= 0 && this.text.lines[this.currentLine].length - 1 >= 0) {
        this.text.lines[this.currentLine] = this.text.lines[this.currentLine].slice(0, this.text.lines[this.currentLine].length - 1);
      } else {
        if (this.currentLine !== 0) {
          this.text.lines.pop();
          this.currentLine--;
        }
      }
    } else {
      this.text.lines[this.currentLine] += event.key;
    }
  }
}
