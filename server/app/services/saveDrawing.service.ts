/*tslint:disable no-require-imports*/

import { injectable } from 'inversify';
import { MongoClient, MongoError } from 'mongodb';
import 'reflect-metadata';
import { Drawing } from '../../../common/communication/drawing';

/*tslint:disable no-var-requires*/
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

@injectable()
export class SaveDrawingService {
    drawingArray: Drawing[];

    async addDrawingtoDatabase(drawing: Drawing): Promise<boolean> {
        try {
            const ret = await this.updateDatabase(drawing);
            return ret;
        } catch (err) {
            return err;
        }
    }
    updateDatabase(drawing: Drawing): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            mongoClient.connect(url, (err: MongoError, db: MongoClient) => {
                if (err) {
                    reject(err);
                }
                const dbo = db.db('drawings');
                /*tslint:disable deprecation only-arrow-functions*/
                dbo.collection('drawings').save(drawing, function(error: MongoError) {
                    if (err) { throw error; }
                    db.close();
                    resolve(true);
                });
            });
        });
    }

    retrieveDrawings(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            mongoClient.connect(url, (err: MongoError, db: MongoClient) => {
                if (err) {
                    reject(err);
                }
                const dbo = db.db('drawings');
                dbo.collection('drawings').find({}).toArray((error: MongoError, result: Drawing[]) => {
                    if (err) { throw error; }
                    this.drawingArray = result;
                    db.close();
                    resolve(true);
                });
            });
        });
    }
    getDrawings(): Drawing[] {
        return this.drawingArray;
    }
    deleteDrawing(drawing: Drawing): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            mongoClient.connect(url, (err: MongoError, db: MongoClient) => {
                if (err) {
                    reject(err);
                }
                const dbo = db.db('drawings');
                dbo.collection('drawings').deleteOne({_id: drawing._id }, (error: MongoError) => {
                    if (err) { throw error; }
                    db.close();
                    resolve(true);
                });
            });
        });

    }
}
