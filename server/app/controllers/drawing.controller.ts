import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { Drawing } from '../../../common/communication/drawing';
import { SaveDrawingService } from '../services/saveDrawing.service';
import Types from '../types';

@injectable()
export class DrawingController {
    router: Router;

    constructor(@inject(Types.SaveDrawingService) private saveDrawingService: SaveDrawingService) {
        this.configureRouter();
    }
    private configureRouter() {
        this.router = Router();
        this.router.post('/save', async (req: Request, res: Response) => {
            const drawingObject = this.convertToDrawing(req);
            this.saveDrawingService.addDrawingtoDatabase(drawingObject)
                .then((ret: boolean) => res.send(ret))
                .catch(() => res.send(false));
        });

        this.router.get('/open', async (req: Request, res: Response) => {
            this.saveDrawingService.retrieveDrawings()
                .then((ret: boolean) => res.send(this.saveDrawingService.getDrawings()))
                .catch(() => res.send(false));
        });
        this.router.post('/delete', async (req: Request, res: Response) => {
            const drawingObject = this.convertToDrawing(req);
            this.saveDrawingService.deleteDrawing(drawingObject)
                .then((ret: boolean) => res.send(ret))
                .catch(() => res.send(false));
        });
    }
    convertToDrawing(req: Request) {
        const drawingObject: Drawing = {
            _id: req.body._id,
            tags: req.body.tags,
            svgList: req.body.svgList,
            drawingColor: req.body.drawingColor,
            drawingHeight: req.body.drawingHeight,
            drawingWidth: req.body.drawingWidth,
        };
        return drawingObject;
    }
}
