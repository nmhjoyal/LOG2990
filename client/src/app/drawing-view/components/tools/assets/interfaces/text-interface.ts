import { ITools } from './itools';

export interface IText extends ITools {
    lines: string[];
    fontSize: number;
    isItalic: boolean;
    isBold: boolean;
}

export interface ITextOptions extends ITools {
    wasSaved: boolean;
    savedText: string[];
    savedFontSize: number;
    savedIsItalic: boolean;
    savedIsBold: boolean;
}
