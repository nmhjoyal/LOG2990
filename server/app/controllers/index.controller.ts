import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

import { Message } from '../../../common/communication/message';
import { IDrawing } from '../../../common/drawing-information/IDrawing';
import { IndexService } from '../services/index.service';
import Types from '../types';
import { ITag } from '../../../common/drawing-information/ITag';

@injectable()
export class IndexController {

    router: Router;

    constructor(@inject(Types.IndexService) private indexService: IndexService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

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
                const success: boolean = await this.indexService.saveTag(req.body.tagToSave);
                res.json(success);
            });

        this.router.get('/getdrawings',
            async (req: Request, res: Response, next: NextFunction) => {
                const drawings: IDrawing[] = await this.indexService.getDrawings();
                res.json(drawings);
            });

        this.router.get('/getdrawing/:id',
            async (req: Request, res: Response, next: NextFunction) => {
                this.indexService.getDrawing(req.params.id).then((drawing: IDrawing) => {
                    res.json(drawing);
                }).catch((err: Error) => {
                    res.json(err.message); // TODO: Send error messages - ex: Not found 
                });
            });

            this.router.get('/gettags',
            async(req: Request, res: Response, next: NextFunction) => {
                const tags: Set<ITag> = await this.indexService.getTags();
                res.json(tags);
            })
    }
}