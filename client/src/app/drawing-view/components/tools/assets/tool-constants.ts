export enum ModeType {
    CONTOUR = 1,
    FILL = 2,
    CONTOUR_FILL = 3,
}
export enum Id {
    RECTANGLE = 'rectangle',
}

export class ToolConstants {
    static NONE = 'none';
    static NULL = -1;
    static DEFAULT_OPACITY = 1;
    static DEFAULT_STROKE_WIDTH = 2;
    static TOOL_ID = Id;
    static TRACE_MODE = ModeType;
}
