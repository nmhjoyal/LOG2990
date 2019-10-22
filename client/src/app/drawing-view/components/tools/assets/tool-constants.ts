export enum Id {
    CRAYON = 'crayon',
    PAINTBRUSH = 'paintbrush',
    RECTANGLE = 'rectangle',
    LINE = 'line',
    SELECTOR = 'selector',
    ELLIPSE = 'ellipse',
}

export enum FilterURL {
    FILTER0 = 'none',
    FILTER1 = 'url(#filter1)',
    FILTER2 = 'url(#filter2)',
    FILTER3 = 'url(#filter3)',
    FILTER4 = 'url(#filter4)',
    FILTER5 = 'url(#filter5)',
}
export enum FilterSelection {
    FILTER0 = 0,
    FILTER1 = 1,
    FILTER2 = 2,
    FILTER3 = 3,
    FILTER4 = 4,
    FILTER5 = 5,
}
export enum ModeType {
    STRAIGHT =  1,
    DOTTED_LINE = 2,
    DOTTED_POINT = 3,
    CONTOUR = 1,
    CONTOUR_FILL = 2,
    FILL = 3,
}
export enum PointType {
    ANGLED = 1,
    ROUNDED = 2,
    DOTTED = 3,
}

export class ToolConstants {
    static NONE = 'none';
    static ROUND = 'round';
    static BUTT = 'butt';
    static SQUARE = 'square';
    static DEFAULT_OPACITY = 1;
    static DEFAULT_STROKE_WIDTH = 2;
    static DEFAULT_POINT_WIDTH = 2;
    static TOOL_ID = Id;
    static FILTER_ID = FilterURL;
    static FILTER_SELECTION = FilterSelection;
    static NULL = -1;
    static TRACE_MODE = ModeType;
    static POINT_MODE = PointType;
    static STRAIGHT =  '0';
    static DOTTED_LINE = '3';
    static DOTTED_POINT = '6';
    static PRIMARY_COLOUR_INDEX = 0;
    static SECONDARY_COLOUR_INDEX = 1;
}
