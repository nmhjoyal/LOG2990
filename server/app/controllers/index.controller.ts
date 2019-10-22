import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

import { IDrawing } from '../../../common/drawing-information/IDrawing';
import { ITag } from '../../../common/drawing-information/ITag';
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
            async (req: Request, res: Response, next: NextFunction) => {
                const tags: ITag[] = await this.indexService.getTags();
                res.json(tags);
            });

    }
}
