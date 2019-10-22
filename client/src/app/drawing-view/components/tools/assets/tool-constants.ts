export enum Id {
    CRAYON = 'crayon',
    PAINTBRUSH = 'paintbrush',
    RECTANGLE = 'rectangle',
    SELECTOR = 'selector',
    ELLIPSE = 'ellipse',
    STAMP = 'stamp',
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
    CONTOUR = 1,
    FILL = 2,
    CONTOUR_FILL = 3,
}

export class ToolConstants {
    static NONE = 'none';
    static ROUND = 'round';
    static DEFAULT_OPACITY = 1;
    static DEFAULT_STROKE_WIDTH = 2;
    static TOOL_ID = Id;
    static FILTER_ID = FilterURL;
    static FILTER_SELECTION = FilterSelection;
    static NULL = -1;
    static TRACE_MODE = ModeType;
    static PRIMARY_COLOUR_INDEX = 0;
    static SECONDARY_COLOUR_INDEX = 1;
    static LEFT_CLICK_INDEX = 0;
    static RIGHT_CLICK_INDEX = 2;
}

export class StampConstants {
    static DEFAULT_ANGLE = 90;
    static DEFAULT_DIMENSION = 24;
    static PATH_SLICER = 6;
    static DEFAULT_SCALE_FACTOR = 1;
    static DEFAULT_WIDTH = 24;
    static DEFAULT_HEIGHT = 24;
    static MAX_SCALE = 21;
}
