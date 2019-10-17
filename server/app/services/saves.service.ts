import {injectable} from 'inversify';
import 'reflect-metadata';
import {IDrawing} from '../../../common/communication/drawing'
import { Message } from '../../../common/communication/message';

@injectable()
export class SavesService {

    savedDrawings: IDrawing[];

    constructor() {
        this.savedDrawings = [];
    }

    sayHello(): Message {
        return {
            title: 'This is savedService',
            body: 'I\'m a bitch',
        };
    }
}