/* tslint:disable */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ExportService } from 'src/app/services/export/export.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { ExportDrawingComponent } from './export-drawing.component';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';

class MockDialog {
  closeAll(): void {
    return ;
  }
  open(content: any) {
    return;
  }
}
describe('ExportDrawingComponent', () => {
  let component: ExportDrawingComponent;
  let fixture: ComponentFixture<ExportDrawingComponent>;
  let dialog: MatDialog;
  let drawingService: DrawingService;
  let exportService: ExportService;
  let shortcutsService: ShortcutsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportDrawingComponent],
      imports: [MatFormFieldModule,
        MatInputModule, MatDialogModule, TestingImportsModule],
      providers: [ShortcutsService ,{provide: MatDialog, useClass: MockDialog}, {provide: MAT_DIALOG_DATA, useValue: {}}],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog', () => {
    const shortcutsService = TestBed.get(ShortcutsService)
    drawingService = new DrawingService();
    drawingService.created = true;
    exportService = new ExportService();
    dialog = TestBed.get(MatDialog);
    component = new ExportDrawingComponent(dialog, exportService, drawingService, shortcutsService);

    component['openDialog'](TestBed.get(MAT_DIALOG_DATA));

    expect(component['drawingCreated']).toBe(drawingService.created);
  });
  it('should trigger exportClicked and change fileType', () => {
    const shortcutsService = TestBed.get(ShortcutsService)
    drawingService = new DrawingService();
    drawingService.created = true;
    exportService = new ExportService();
    dialog = TestBed.get(MatDialog);
    component = new ExportDrawingComponent(dialog, exportService, drawingService, shortcutsService);
    const fileName = 'fileName';
    component['fileName'] = fileName;
    const fileType = 'fileType';
    const spy = spyOn(exportService, 'exportClicked');
    component['export'](fileType);
    expect(exportService.exportFileType).toBe(fileType);
    expect(spy).toHaveBeenCalled();
    expect(exportService.exportFileName).toBe(fileName);

  });
});
