
// tslint:disable:max-classes-per-file

export enum Id {
    RECTANGLE = 'rectangle',
    POLYGON = 'polygon',
    CRAYON = 'crayon',
    PAINTBRUSH = 'paintbrush',
    LINE = 'line',
    SELECTOR = 'selector',
    ELLIPSE = 'ellipse',
    STAMP = 'stamp',
    TEXT = 'text',
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
    static DEFAULT_POINT_WIDTH = 2;
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
    static ANGLE_INCREMENT_1 = 1;
    static ANGLE_INCREMENT_15 = 15;
}