import {inject, injectable} from 'inversify';
import 'reflect-metadata';
// import {Message} from '../../../common/communication/message';
import Types from '../types';
import {DateService} from './date.service';

@injectable()
export class SavesService {
    constructor(
        @inject(Types.DateService) private dateService: DateService,
    ) {
    }
}