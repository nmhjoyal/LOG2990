import {NextFunction, Request, Response, Router} from 'express';
import {inject, injectable} from 'inversify';

// import {Message} from '../../../common/communication/message';
import {SavesService} from '../services/saves.service';
import Types from '../types';

@injectable()
export class IndexController {

    router: Router;

    constructor(@inject(Types.SavesService) private savesService: SavesService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        
        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {}););
    }
}