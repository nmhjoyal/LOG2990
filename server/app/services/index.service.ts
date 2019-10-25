import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Message } from '../../../common/communication/message';
import { IDrawing } from '../../../common/drawing-information/IDrawing';
import { ITag } from '../../../common/drawing-information/ITag';
import Types from '../types';
import { DateService } from './date.service';

@injectable()
export class IndexService {
    drawingsList: IDrawing[];
    tags: ITag[];

    drawingsInGallery: Map<string, IDrawing>;

    constructor(
        @inject(Types.DateService) private dateService: DateService,
    ) {
        this.drawingsInGallery = new Map<string, IDrawing>();
        this.tags = [];
    }

    async helloWorld(): Promise<Message> {
        return this.dateService.currentTime().then((timeMessage: Message) => {
            return {
                title: 'Hello world',
                body: 'Time is ' + timeMessage.body,
            };
        }).catch((error: unknown) => {
            console.error(`There was an error!!!`, error);

            return {
                title: `Error`,
                body: error as string,
            };
        });
    }

    async saveDrawing(drawingToSave: IDrawing): Promise<boolean> {
        if (!drawingToSave.name || (drawingToSave.tags && drawingToSave.tags.some((tag) => tag.name === ' '))) {
            return false;
        }
        if (drawingToSave.timestamp) {
            this.drawingsInGallery.set(this.dateToId(drawingToSave.timestamp), drawingToSave);
            return true;
        }
        return false;
    }

    async saveTag(tagToSave: ITag): Promise<boolean> {
        if (!this.tags.some((tag) => tag.name === tagToSave.name)) {
            this.tags.push(tagToSave);
            return true;
        }

        return false;
    }

    async getDrawings(): Promise<IDrawing[]> {
        return Array.from(this.drawingsInGallery.values());
    }

    async getDrawing(drawingTimestampID: string): Promise<IDrawing | undefined> {
        return this.drawingsInGallery.get(drawingTimestampID);
    }

    async getTags(): Promise<ITag[]> {
        return Array.from(this.tags.values());
    }

    private dateToId(date: string): string {
        return date.replace(/[^0-9]/g, '');
    }
}
