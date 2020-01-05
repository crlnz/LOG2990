/* tslint:disable */

import { assert } from 'chai';
import Sinon = require('sinon');
import { Drawing } from '../../../common/communication/drawing';
import { SaveDrawingService } from './saveDrawing.service';

describe('SaveDrawingService', () => {

  let saveDrawing: SaveDrawingService;

  beforeEach(() => {
     saveDrawing = new SaveDrawingService();
  });

  it('should addDrawingToDatabase', async () => {
    let drawing:Drawing ={
      _id: 'tester',
      tags: [],
      svgList: [],
      drawingColor: '',
      drawingHeight: '',
      drawingWidth: '',
    }
    const spy = Sinon.spy(SaveDrawingService.prototype, 'updateDatabase');
    await saveDrawing.addDrawingtoDatabase(drawing as Drawing);
    Sinon.assert.calledOnce(spy);
    saveDrawing.deleteDrawing(drawing as Drawing);
  });

  it('should updateDatabase', async () => {
    let drawing:Drawing ={
      _id: 'tester',
      tags: [],
      svgList: [],
      drawingColor: '',
      drawingHeight: '',
      drawingWidth: '',
    }
    const value: boolean = await saveDrawing.updateDatabase(drawing as Drawing);
    assert.deepEqual(value, true);
    saveDrawing.deleteDrawing(drawing as Drawing);
  });

  it('should retrieveDrawings', async () => {
    const value: boolean = await saveDrawing.retrieveDrawings();
    assert.deepEqual(value, true);
  });

  it('should delete drawing', async() =>{
    let drawing:Drawing ={
      _id: 'tester',
      tags: [],
      svgList: [],
      drawingColor: '',
      drawingHeight: '',
      drawingWidth: '',
    }
    const value: boolean = await saveDrawing.deleteDrawing(drawing as Drawing);
    assert.deepEqual(value, true);
  })
});
