export enum ModeType {
    CONTOUR = 1,
    FILL = 2,
    CONTOUR_FILL = 3,
}

export enum Id {
    CRAYON = 'crayon',
    PAINTBRUSH = 'paintbrush',
}

export enum Filter {
    FILTER0 = 'none',
    FILTER1 = 'url(#filter1)',
    FILTER2 = 'url(#filter2)',
    FILTER3 = 'url(#filter3)',
    FILTER4 = 'url(#filter4)',
    FILTER5 = 'url(#filter5)',
}

export class ToolConstants {
    static NONE = 'none';
    static DEFAULT_OPACITY = 1;
    static DEFAULT_STROKE_WIDTH = 2;
    static ROUND = 'round';
    static TOOL_ID = Id;
    static TRACE_MODE = ModeType;
    static FILTER_ID = Filter;
}