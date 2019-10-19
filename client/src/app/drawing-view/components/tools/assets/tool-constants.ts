export enum ModeType {
    CONTOUR = 1,
    FILL = 2,
    CONTOUR_FILL = 3,
}
export enum PointType {
    ANGLED = 1,
    ROUNDED = 2,
    DOTTED = 3,
}
export enum Id {
    RECTANGLE = 'rectangle',
    LINE = 'line',
}

export class ToolConstants {
    static NONE = 'none';
    static NULL = -1;
    static DEFAULT_OPACITY = 1;
    static DEFAULT_STROKE_WIDTH = 2;
    static DEFAULT_POINT_WIDTH = 2;
    static TOOL_ID = Id;
    static TRACE_MODE = ModeType;
    static POINT_MODE = PointType;
}
