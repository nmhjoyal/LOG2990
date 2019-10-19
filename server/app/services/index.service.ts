import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Message } from '../../../common/communication/message';
import { IDrawing } from '../../../common/drawing-information/IDrawing';
import { ITag } from '../../../common/drawing-information/ITag';
import Types from '../types';
import { DateService } from './date.service';

@injectable()
export class IndexService {
    constructor(
        @inject(Types.DateService) private dateService: DateService,
    ) {
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
        const drawings: any[] = [];
        drawings.push(drawingToSave);
        console.log('SAVING');
        console.log(drawingToSave);
        return true;
    }

    async saveTags(tagToSave: ITag): Promise<boolean> {
        const tags: any = [];
        tags.push(tagToSave);
        console.log('SAVING');
        console.log(tags);
        return true;
    }
}
