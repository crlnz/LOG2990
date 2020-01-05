/* tslint:disable */

import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { OpenDrawingService } from 'src/app/services/open-drawing/open-drawing.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { OpenDrawingComponent } from './open-drawing.component';
import { SanitizeHtmlPipe } from './sanitizeHtml.pipe';
class MockDialog {
  closeAll(): void {
    return;
  }
  open(content: any) {
    return;
  }
}

describe('OpenDrawingComponent', () => {
  let component: OpenDrawingComponent;
  let fixture: ComponentFixture<OpenDrawingComponent>;
  let openDrawingService: OpenDrawingService;
  let dialog: MatDialog;
  let shortcutsService: ShortcutsService;
  let drawingService: DrawingService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OpenDrawingComponent, SanitizeHtmlPipe],
      imports: [MatFormFieldModule,
        MatInputModule, MatDialogModule, TestingImportsModule],
      providers: [ShortcutsService, { provide: MatDialog, useClass: MockDialog }, { provide: MAT_DIALOG_DATA, useValue: {} }, FileList],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should update existing drawing with server drawing if drawing created', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const drawingService = new DrawingService();
    const dialog = TestBed.get(MatDialog);
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    const fileName = 'serverDrawing';
    component['drawingCreated'] = true;
    const spy = spyOn<any>(component, 'updateExistingDrawing');
    component['openServerDrawing'](fileName);
    expect(component['fileName']).toBe(fileName);
    expect(spy).toHaveBeenCalled();
  });
  it('should update currentDrawing with server drawing if drawing not created ', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const drawingService = new DrawingService();
    const dialog = TestBed.get(MatDialog);
    const openDrawingService = new OpenDrawingService(TestBed.get(HttpClient));
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    const fileName = 'serverDrawing';
    component['drawingCreated'] = false;
    const drawing = {
      _id: 'serverDrawing',
      tags: [],
      svgList: [],
      drawingColor: '',
      drawingHeight: '',
      drawingWidth: '',
    };
    component['displayedDrawings'].push(drawing);
    component['openServerDrawing'](fileName);
    expect(openDrawingService.currentDrawingData).toBe(drawing);
  });
  it('should set current drawing to local drawing if drawing is created', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const drawingService = new DrawingService();
    const dialog = TestBed.get(MatDialog);
    const openDrawingService = new OpenDrawingService(TestBed.get(HttpClient));
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    component['drawingCreated'] = true;
    const drawing = {
      _id: 'localDrawing',
      tags: [],
      svgList: [],
      drawingColor: '',
      drawingHeight: '',
      drawingWidth: '',
    };
    component['localDrawing'] = drawing;
    component['openLocalDrawing']();
    expect(component['fileName']).toBe(component['localDrawing']._id);
  });

  it('should set current drawing to local drawing if drawing is created', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const drawingService = new DrawingService();
    const dialog = TestBed.get(MatDialog);
    const openDrawingService = new OpenDrawingService(TestBed.get(HttpClient));
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    component['drawingCreated'] = false;
    const drawing = {
      _id: 'localDrawing',
      tags: [],
      svgList: [],
      drawingColor: '',
      drawingHeight: '',
      drawingWidth: '',
    };
    component['localDrawing'] = drawing;
    component['openLocalDrawing']();
    expect(openDrawingService.currentDrawingData).toBe(component['localDrawing']);
  });
  it('should update existing drawing', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    component['updateExistingDrawing']();
    expect(component['openWarning']).toBe(true);
    expect(component['drawingCreated']).toBe(false);
  });
  it('should update attributes when no drawing', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const drawingService = new DrawingService();
    const dialog = TestBed.get(MatDialog);
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    component['updateNoDrawing']();
    expect(component['stateOpenDrawing']).toBe(false);
    expect(drawingService.created).toBe(true);
    expect(component['loading']).toBe(true);
  });

  it('should open local drawing when confirmed if drawing is local', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    component['localTabSelected'] = true;
    const spy = spyOn<any>(component, 'openLocalDrawing');
    component['confirmOpen']();
    expect(spy).toHaveBeenCalled();
  });

  it('should open server drawing when confirmed if drawing from server', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    component['localTabSelected'] = false;
    const spy = spyOn<any>(component, 'openServerDrawing');
    component['confirmOpen']();
    expect(spy).toHaveBeenCalled();
  });
  it('should open modal and retrieve from server', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const dialog = TestBed.get(MatDialog);
    const openDrawingService = new OpenDrawingService(TestBed.get(HttpClient));
    const drawingService = new DrawingService();
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    const spy = spyOn<any>(component, 'retrieveDrawingsFromServer');
    component['openModal'](TestBed.get(MAT_DIALOG_DATA));
    expect(component['tag']).toBe('');
    expect(spy).toHaveBeenCalled();
  });

  it('should reset attributes on open', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    component['resetAttributesOnOpen']();
    expect(component['loading']).toBe(true);
    expect(component['openWarning']).toBe(false);
    expect(component['noMatchTag']).toBe(false);
    expect(component['stateOpenDrawing']).toBe(true);
    expect(component['localDrawingLoaded']).toBe(false);
    expect(component['localFileIsInvalid']).toBe(false);
  });

  it('should cancel open', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const dialog = TestBed.get(MatDialog);
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    component['cancelOpen']();
    expect(component['noMatchTag']).toBe(false);
    expect(component['stateOpenDrawing']).toBe(false);
    expect(component['tag']).toBe('');
    expect(component['noMatchTag']).toBe(false);
  });

  it('should display all drawings if tag is empty', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    component['tag'] = '';
    const drawing = {
      _id: 'serverDrawing',
      tags: [],
      svgList: [],
      drawingColor: '',
      drawingHeight: '',
      drawingWidth: '',
    };
    component['drawings'].push(drawing);
    component['sendTag']();
    expect(component['displayedDrawings']).toBe(component['drawings']);
  });

  it('should display drawings with same tag', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    component['tag'] = 'tag';
    const drawing = {
      _id: 'serverDrawing',
      tags: ['tag'],
      svgList: [],
      drawingColor: '',
      drawingHeight: '',
      drawingWidth: '',
    };
    component['serverDrawings'] = [];
    component['serverDrawings'].push(drawing);
    component['sendTag']();
    expect(component['displayedDrawings']).toEqual(component['serverDrawings']);
  });

  it('should update drawings', () => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    const drawing = {
      _id: 'serverDrawing',
      tags: ['tag'],
      svgList: [],
      drawingColor: '',
      drawingHeight: '',
      drawingWidth: '',
    };
    const drawingArray = [];
    drawingArray.push(drawing);
    component['tag'] = '';
    component['updateDrawings'](drawingArray);
    expect(component['drawings']).toEqual(drawingArray);

  });
  it('should read file', async(() => {
    const shortcutsService = TestBed.get(ShortcutsService);
    const component = new OpenDrawingComponent(openDrawingService, dialog, shortcutsService, drawingService);
    const blob = new Blob([''], { type: 'text/html' });
    const file = blob as File;
    const fileList = {
      0: file,
      1: file,
      length: 2,
      item: (index: number) => file,
    };
    component['readFile'](fileList);
    const mockFileReader = {
      result: '',
      readAsDataURL: (blobInput: any) => {
        console.log('readAsDataURL');
      },
      onloadend: () => {
        console.log('onloadend');
      },
    };
    spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
    spyOn<any>(mockFileReader, 'readAsDataURL').and.callFake((blobInput: any) => {
      mockFileReader.result = 'string';
      mockFileReader.onloadend();
    });

    fixture.whenStable().then(() => {
      expect(component['localDrawingLoaded']).toBe(true);
    });

  }));

});

