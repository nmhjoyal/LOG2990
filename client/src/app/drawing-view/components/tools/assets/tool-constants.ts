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
    FILTER1 = 'none',
    FILTER2 = 'url(#filter1)',
    FILTER3 = 'url(#filter2)',
    FILTER4 = 'url(#filter3)',
    FILTER5 = 'url(#filter4)',
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
