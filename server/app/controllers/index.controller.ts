import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

import { Message } from '../../../common/communication/message';
import { IndexService } from '../services/index.service';
import Types from '../types';

@injectable()
export class IndexController {

    router: Router;

    constructor(@inject(Types.IndexService) private indexService: IndexService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept',
            );
        });

        this.router.get('/',
            async (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                const time: Message = await this.indexService.helloWorld();
                res.json(time);
            });

        this.router.get('/about',
            (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                res.json(this.indexService.about());
            });

        this.router.post('/save',
            async (req: Request, res: Response, next: NextFunction) => {
                const success: boolean = await this.indexService.saveDrawing(req.body.drawingToSave);
                res.json(success);
            });

        this.router.post('/tags',
            async (req: Request, res: Response, next: NextFunction) => {
                const success: boolean = await this.indexService.saveTags(req.body.tags);
                res.json(success);
            })
    }
}
