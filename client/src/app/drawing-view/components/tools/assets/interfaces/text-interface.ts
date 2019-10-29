import { ITools } from './itools';

export interface IText extends ITools {
    lines: string[];
    fontSize: number;
    italic: string;
    bold: string;
    align: string;
    fontFamily: string;
}

export interface ITextOptions extends ITools {
    wasSaved: boolean;
    savedText: string[];
    savedFontSize: number;
    savedItalic: string;
    savedBold: string;
    savedAlign: string;
    savedFontFamily: string;
}
