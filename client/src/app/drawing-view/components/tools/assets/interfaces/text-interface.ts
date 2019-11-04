import { ITools } from './itools';

export interface TextBox {
    boxXPosition?: number;
}

export interface IText extends ITools {
    lines: string[];
    fontSize: number;
    italic: string;
    bold: string;
    align: string;
    fontFamily: string;
    primaryColour: string;
}

export interface ITextOptions extends ITools {
    wasSaved: boolean;
    savedFontSize: number;
    savedItalic: string;
    savedBold: string;
    savedFontFamily: string;
    savedPrimaryColour: string;
}
