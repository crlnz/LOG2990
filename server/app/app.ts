import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';
import { DrawingController } from './controllers/drawing.controller';
import Types from './types';

@injectable()

export class Application {
    app: express.Application;

    constructor(@inject(Types.DrawingController) private drawingController: DrawingController) {
        this.app = express();
        this.config();
        this.bindRoutes();
    }
    private config(): void {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }
    bindRoutes(): void {
        // Notre application utilise le routeur de notre API `Index`
        this.app.use('/api', this.drawingController.router);
    }
}
