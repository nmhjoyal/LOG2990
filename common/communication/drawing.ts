import { IDrawingTool } from '../../client/src/app/drawing-view/components/tools/assets/interfaces/shape-interface'

export interface IDrawing {
    title: string,
    tags: string[],
    drawings: IDrawingTool[], // look into taking a snapshot of the draing upon save to reduce cost of displaying drawings preview...
}