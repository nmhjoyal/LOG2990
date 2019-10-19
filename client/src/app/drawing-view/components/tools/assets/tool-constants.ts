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
}

export class ToolConstants {
    static NONE = 'none';
    static NULL = -1;
    static DEFAULT_OPACITY = 1;
    static DEFAULT_STROKE_WIDTH = 2;
    static TOOL_ID = Id;
    static TRACE_MODE = ModeType;
}
