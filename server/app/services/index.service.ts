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

    // TODO: Choose a container type for the drawings list - and move it to storage service
    drawingsInGallery: Map<string, IDrawing>;

    constructor(
        @inject(Types.DateService) private dateService: DateService,
    ) {
        // this.drawingsList = [];
        this.drawingsInGallery = new Map<string, IDrawing>();
        this.tags = [];
    }

    about(): Message {
        return {
            title: 'This is merely a test',
            body: 'Lorem ipsum........',
        };
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
        // this.drawingsList.push(drawingToSave);
        if (drawingToSave.timestamp) {
            this.drawingsInGallery.set(this.dateToId(drawingToSave.timestamp), drawingToSave);
            console.log('Saving drawing with id: ' + this.dateToId(drawingToSave.timestamp));
            console.log(drawingToSave);
            return true;
        }
        return false;
    }

    async saveTag(tagToSave: ITag): Promise<boolean> {
        this.tags.push(tagToSave);
        console.log('SAVING ' + tagToSave.name);
        console.log(this.tags);
        return true;
    }

    async getDrawings(): Promise<IDrawing[]> {
        console.log('sending drawings');
        return Array.from(this.drawingsInGallery.values());
    }

    async getDrawing(drawingTimestampID: string): Promise<IDrawing | undefined> {
        console.log('sending drawing of timestampID: ' + drawingTimestampID);
        return this.drawingsInGallery.get(drawingTimestampID);
    }

    async getTags(): Promise<ITag[]> {
        console.log('sending tags');
        return Array.from(this.tags);
    }

    // TODO: Move in a common to share with client/index.service
private dateToId(date: string): string {
        return date.replace(/[^0-9]/g, '');
    }
}