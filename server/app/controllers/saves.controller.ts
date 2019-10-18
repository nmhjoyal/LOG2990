import {NextFunction, Request, Response, Router} from 'express';
import {injectable, inject} from 'inversify';
// import {Message} from '../../../common/communication/message';
import {SavesService} from '../services/saves.service';
import Types from '../types';

@injectable()
export class SavesController {

    router: Router;

    constructor(@inject(Types.SavesService) private savesService: SavesService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        
        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            res.send('<p>Page contenant les dessins sauvegardés</p>');
        });
    }
}