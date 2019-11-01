import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

import { Message } from '../../../common/communication/message';
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

        this.router.post('/drawubg',
            async (req: Request, res: Response, next: NextFunction) => {
                const success: boolean | undefined = await this.indexService.saveDrawing(req.body.drawingToSave);
                res.json(success);
            });

        this.router.post('/tags',
            async (req: Request, res: Response, next: NextFunction) => {
                const success: boolean | undefined = await this.indexService.saveTag(req.body.tagToSave);
                res.json(success);
            });

        this.router.get('/drawings',
            async (req: Request, res: Response, next: NextFunction) => {
                const drawings: IDrawing[] | undefined = await this.indexService.getDrawings();
                res.json(drawings);
            });

        this.router.get('/drawing/:id',
            async (req: Request, res: Response, next: NextFunction) => {
                this.indexService.getDrawing(req.params.id).then((drawing: IDrawing | undefined) => {
                    res.json(drawing);
                }).catch((err: Error) => {
                    res.json(err.message);
                });
            });

        this.router.get('/tag',
            async (req: Request, res: Response, next: NextFunction) => {
                const tags: ITag[] | undefined = await this.indexService.getTags();
                res.json(tags);
            });

    }
}
