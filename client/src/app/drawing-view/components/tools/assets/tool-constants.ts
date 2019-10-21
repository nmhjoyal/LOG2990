
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

export enum ShapeType {
    TRI = 3,
    TETRA = 4,
    PENTA = 5,
    HEXA = 6,
    HEPTA = 7,
    OCTA = 8,
    NONA = 9,
    DECA = 10,
    HENDECA = 11,
    DODECA = 12,

}

export enum Id {
    RECTANGLE = 'rectangle',
    POLYGON = 'polygon',
    CRAYON = 'crayon',
    PAINTBRUSH = 'paintbrush',
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
    static MIN_VERTEX_NUMBER = 3;
    static MAX_VERTEX_NUMBER = 12;
    static PRIMARY_COLOUR_INDEX = 0;
    static SECONDARY_COLOUR_INDEX = 1;
}
