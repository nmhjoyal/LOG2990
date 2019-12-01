
// tslint:disable:max-classes-per-file

export enum Id {
    NONE = 'none',
    RECTANGLE = 'rectangle',
    POLYGON = 'polygon',
    CRAYON = 'crayon',
    PAINTBRUSH = 'paintbrush',
    PEN = 'pen',
    QUILL = 'quill',
    LINE = 'line',
    SELECTOR = 'selector',
    ELLIPSE = 'ellipse',
    STAMP = 'stamp',
    COLOUR_APPLICATOR = 'colourApplicator',
    PIPETTE = 'pipette',
    TEXT = 'text',
    GRID = 'grid',
    ERASER = 'eraser',
    PRIMARY_COLOUR_CHANGE = 'primaryColourChange',
    SECONDARY_COLOUR_CHANGE = 'secondaryColourChange',
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

enum STAMPS {
    HEART = '../../../../../../assets/stamps/grade-24px.svg',
    SMILEY = '../../../../../../assets/stamps/sentiment_satisfied_alt-24px.svg',
    PAW = '../../../../../../assets/stamps/pets-24px.svg',
    STAR = '../../../../../../assets/stamps/favorite-24px.svg',
    THUMB_UP = '../../../../../../assets/stamps/thumb_up-24px.svg',
    SUN = '../../../../../../assets/stamps/brightness_5-24px.svg',
}

export class ToolConstants {
    static NONE = 'none';
    static ROUND = 'round';
    static BUTT = 'butt';
    static SQUARE = 'square';
    static DEFAULT_OPACITY = 1;
    static DEFAULT_STROKE_WIDTH = 2;
    static DEFAULT_MAX_WIDTH = 10;
    static DEFAULT_MIN_WIDTH = 2;
    static DEFAULT_LINE_LENGTH = 10;
    static DEFAULT_ANGLE = 0;
    static MAX_STROKE_WIDTH = 20;
    static MIN_STROKE_WIDTH = 1;
    static MAX_SPEED = 0.4;
    static MIN_SPEED = 0.0007;
    static STROKE_INCREMENT = 1;
    static AVG_SPEED = 4.5;
    static TOOL_ID = Id;
    static FILTER_ID = FilterURL;
    static FILTER_SELECTION = FilterSelection;
    static NULL = -1;
    static TRACE_MODE = ModeType;
    static MIN_VERTEX_NUMBER = 3;
    static MAX_VERTEX_NUMBER = 12;
    static POINT_MODE = PointType;
    static STRAIGHT =  '0';
    static DOTTED_LINE = '3';
    static DOTTED_POINT = '6';
    static PRIMARY_COLOUR_INDEX = 0;
    static SECONDARY_COLOUR_INDEX = 1;
    static LEFT_CLICK_INDEX = 0;
    static RIGHT_CLICK_INDEX = 2;
    static ANGLE_INCREMENT_1 = 1;
    static ANGLE_INCREMENT_15 = 15;
}

export class StampConstants {
    static STAMPS_PATHS = STAMPS;
    static DEFAULT_ANGLE = 0;
    static DEFAULT_DIMENSION = 24;
    static PATH_SLICER = 6;
    static DEFAULT_SCALE_FACTOR = 1;
    static DEFAULT_WIDTH = 24;
    static DEFAULT_HEIGHT = 24;
    static MAX_SCALE = 21;
}
