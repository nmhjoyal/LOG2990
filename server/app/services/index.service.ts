import { injectable } from 'inversify';
import 'reflect-metadata';
import { IDrawing } from '../../../common/drawing-information/IDrawing';
import { ITag } from '../../../common/drawing-information/ITag';

@injectable()
export class IndexService {
    drawingsList: IDrawing[];
    tags: ITag[];

    drawingsInGallery: Map<string, IDrawing>;

    constructor() {
        this.drawingsInGallery = new Map<string, IDrawing>();
        this.tags = [];
    }

    async saveDrawing(drawingToSave: IDrawing): Promise<boolean | undefined> {
        if (!drawingToSave.name || (drawingToSave.tags && drawingToSave.tags.some((tag) => tag.name === ' '))) {
            return false;
        }
        if (drawingToSave.timestamp) {
            this.drawingsInGallery.set(this.dateToId(drawingToSave.timestamp), drawingToSave);
            return true;
        }
        return false;
    }

    async saveTag(tagToSave: ITag): Promise<boolean | undefined> {
        if (!this.tags.some((tag) => tag.name === tagToSave.name)) {
            this.tags.push(tagToSave);
            return true;
        }

        return false;
    }

    async getDrawings(): Promise<IDrawing[] | undefined> {
        return Array.from(this.drawingsInGallery.values());
    }

    async getDrawing(drawingTimestampID: string): Promise<IDrawing | undefined> {
        return this.drawingsInGallery.get(drawingTimestampID);
    }

    async getTags(): Promise<ITag[] | undefined> {
        return Array.from(this.tags.values());
    }

    private dateToId(date: string): string {
        return date.replace(/[^0-9]/g, '');
    }
}
