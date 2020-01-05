/* tslint:disable */

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Sanitizer } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { FormService } from 'src/app/services/form/form.service';
import { SaveService } from 'src/app/services/save/save.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { SanitizeHtmlPipe } from '../open-drawing/sanitizeHtml.pipe';
import { SaveDrawingComponent } from './save-drawing.component';

class MockDialog {
  closeAll(): void {
    return ;
  }
  open(content: any) {
    return;
  }
}
class MockSanitizer {
  bypassSecurityTrustURL(element: any) {
    return;
  }
}

describe('SaveDrawingComponent', () => {
  let component: SaveDrawingComponent;
  let fixture: ComponentFixture<SaveDrawingComponent>;
  let dialog: MatDialog;
  let saveService: SaveService;
  let shortcutsService: ShortcutsService;
  let formBuilder: FormBuilder;
  let sanitizer: DomSanitizer;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({

      declarations: [ SaveDrawingComponent, SanitizeHtmlPipe ],
      imports: [ MatFormFieldModule, HttpClientTestingModule,
        MatInputModule, MatDialogModule, TestingImportsModule ],
      providers: [HttpTestingController, {provide: MatDialog, useClass: MockDialog}, ShortcutsService,
        {provide: Sanitizer, useClass: MockSanitizer}, {provide: MAT_DIALOG_DATA, useValue: {}} ],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save to server', () => {
    expect(component).toBeTruthy();
    const formService = new FormService();
    const drawingService = new DrawingService();
    const httpClient = TestBed.get(HttpClient);
    const saveService = new SaveService(httpClient);
    const shortcutsService = TestBed.get(ShortcutsService);
    const sanitizer = TestBed.get(Sanitizer);
    dialog = TestBed.get(MatDialog);
    component = new SaveDrawingComponent(saveService, dialog, drawingService, shortcutsService, formService, formBuilder, sanitizer);
    const drawingProperties = {
      color: 'red',
      width: '5',
      height: '5',
    };
    formService.drawingProperties = drawingProperties;
    component['drawingInfo'] = new FormGroup({
      name: new FormControl(''),
      tag: new FormControl([]),
    });
    component['drawingInfo'].value.name = 'id';
    component['isLocalSave'] = false;
    drawingService.drawingArray = [];
    const spy = spyOn<any>(component, 'saveToServer');
    component['onSubmit']();
    expect(component['drawingProperties']).toBe(formService.drawingProperties);
    expect(spy).toHaveBeenCalled();
  });

  it('should save locally', () => {
    expect(component).toBeTruthy();
    const formService = new FormService();
    const drawingService = new DrawingService();
    const httpClient = TestBed.get(HttpClient);
    const saveService = new SaveService(httpClient);
    const shortcutsService = TestBed.get(ShortcutsService);
    const sanitizer = TestBed.get(Sanitizer);
    dialog = TestBed.get(MatDialog);
    component = new SaveDrawingComponent(saveService, dialog, drawingService, shortcutsService, formService, formBuilder, sanitizer);
    const drawingProperties = {
      color: 'red',
      width: '5',
      height: '5',
    };
    formService.drawingProperties = drawingProperties;
    component['drawingInfo'] = new FormGroup({
      name: new FormControl(''),
      tag: new FormControl([]),
    });
    component['drawingInfo'].value.name = 'id';
    component['isLocalSave'] = true;
    drawingService.drawingArray = [];
    const spy = spyOn<any>(component, 'saveLocally');
    component['onSubmit']();
    expect(component['drawingProperties']).toBe(formService.drawingProperties);
    expect(spy).toHaveBeenCalled();
  });

  it('should update localSave', () => {
    expect(component).toBeTruthy();
    const formService = new FormService();
    const drawingService = new DrawingService();
    shortcutsService = TestBed.get(ShortcutsService);
    component = new SaveDrawingComponent(saveService,dialog,drawingService, shortcutsService, formService, formBuilder,sanitizer)
    let drawingProperties ={
      color:'red',
      width: '5',
      height: '5',
    };
    formService.drawingProperties = drawingProperties;
    component['drawingInfo'] = new FormGroup({
      name: new FormControl(''),
      tag: new FormControl([]),
    });
    component['drawingInfo'].value.name = 'id';
    component['isLocalSave'] = true;
    drawingService.drawingArray=[];
    component['updateLocalSave']();
    expect(component['isLocalSave']).toBe(false);
  });

  it('should cancel modal', () => {
    expect(component).toBeTruthy();
    const formService = new FormService();
    const drawingService = new DrawingService();
    const shortcutsService = TestBed.get(ShortcutsService);
    const dialog = TestBed.get(MatDialog);
    component = new SaveDrawingComponent(saveService, dialog, drawingService, shortcutsService, formService, formBuilder, sanitizer);
    const drawingProperties = {
      color: 'red',
      width: '5',
      height: '5',
    };
    formService.drawingProperties = drawingProperties;
    component['drawingInfo'] = new FormGroup({
      name: new FormControl(''),
      tag: new FormControl([]),
    });
    component['drawingInfo'].value.name = 'id';
    component['isLocalSave'] = true;
    drawingService.drawingArray = [];
    const spy = spyOn(shortcutsService, 'changeModalStateSaveDrawing');
    component['cancel']();
    expect(spy).toHaveBeenCalled();
    expect(component['stateSaveDrawing']).toBe(false);
  });

  it('should open dialog and set attributes', () => {
    expect(component).toBeTruthy();
    const formService = new FormService();
    const drawingService = new DrawingService();
    drawingService.created = true;
    const shortcutsService = TestBed.get(ShortcutsService);
    const dialog = TestBed.get(MatDialog);
    component = new SaveDrawingComponent(saveService, dialog, drawingService, shortcutsService, formService, formBuilder, sanitizer);
    const drawingProperties = {
      color: 'red',
      width: '5',
      height: '5',
    };
    formService.drawingProperties = drawingProperties;
    component['drawingInfo'] = new FormGroup({
      name: new FormControl(''),
      tag: new FormControl([]),
    });
    component['drawingInfo'].value.name = 'id';
    component['isLocalSave'] = true;
    drawingService.drawingArray = [];
    const spy = spyOn<any>(component, 'updateLocalSave');
    component['openDialog'](TestBed.get(MAT_DIALOG_DATA));
    expect(component['saved']).toBe(false);
    expect(component['stateSaveDrawing']).toBe(true);
    expect(spy).toHaveBeenCalled();
    expect(component['drawingCreated']).toBe(drawingService.created);
  });
});
