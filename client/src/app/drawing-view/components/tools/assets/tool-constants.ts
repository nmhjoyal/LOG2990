export enum ModeType {
    CONTOUR = 1,
    FILL = 2,
    CONTOUR_FILL = 3,
}
export enum Id {
    RECTANGLE = 'rectangle',
}

export class ToolConstants {
    static NONE: string = 'none';
    static NULL: number = -1;
    static DEFAULT_OPACITY: number = 1;
    static DEFAULT_STROKE_WIDTH: number = 2;
    static TOOL_ID = Id;
    static TRACE_MODE = ModeType;
}
