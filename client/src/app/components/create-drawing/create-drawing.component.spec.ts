/* tslint:disable */
import { async, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingToolService } from 'src/app/services/drawing-tools/drawing-tools.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { FormService } from 'src/app/services/form/form.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { IconService } from 'src/app/services/Icon/icon.service';
import { SelectionService } from 'src/app/services/selection/selection.service';
import { ShapeService } from 'src/app/services/shape/shape.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { StampService } from 'src/app/services/stamp/stamp.service';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { TestingImportsModule } from '../../testing-imports/testing-imports';
import { ColorPaletteComponent } from '../color-tools/color-palette/color-palette.component';
import { ColorPickerComponent } from '../color-tools/color-picker/color-picker.component';
import { CreateDrawingModalComponent } from './create-drawing.component';
import { ManipulationService } from 'src/app/services/manipulation/manipulation.service';

describe('CreateDrawingComponent', () => {
  let colorDialog: MatDialog;
  let component: CreateDrawingModalComponent;
  let dialog: MatDialog;
  let shortcut: ShortcutsService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateDrawingModalComponent, ColorPickerComponent, ColorPaletteComponent],
      imports: [TestingImportsModule],
      providers: [IconService, ShortcutsService, FormService, DrawingService, { provide: MAT_DIALOG_DATA, useValue: {} }],
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    const iconService = new IconService();
    const shapeService = new ShapeService();
    const drawingToolService = new DrawingToolService();
    const toolsService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const drawingService = new DrawingService();
    const colorService = new ColorService();
    const shortcutService = new ShortcutsService(shapeService, drawingToolService, toolsService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const form = new FormService();
    component = new CreateDrawingModalComponent(colorDialog, dialog, form, iconService, shortcut, drawingService, colorService, shortcutService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the toggleRgba method and enable certain fields', () => {
    component['showRgba'] = true;
    component['toggleRgba']();
    expect(component['showRgba']).toBe(false);

    expect(expect(component['drawingForm'].controls.red.enabled).toBe(false));
    expect(component['drawingForm'].controls.blue.enabled).toBe(false);
    expect(component['drawingForm'].controls.green.enabled).toBe(false);
    expect(component['drawingForm'].controls.alpha.enabled).toBe(false);
  });

  it('should call the toggleRgba method and disable certain fields', () => {
    component['showRgba'] = false;
    component['toggleRgba']();
    expect(component['showRgba']).toBe(true);
    expect(expect(component['drawingForm'].controls.red.enabled).toBe(true));
    expect(component['drawingForm'].controls.blue.enabled).toBe(true);
    expect(component['drawingForm'].controls.green.enabled).toBe(true);
    expect(component['drawingForm'].controls.alpha.enabled).toBe(true);
  });

  it('should update the dimensions on the form fields', () => {
    component['iconService'].setInitialDimensions('10', '10');
    component['changeValueHeight'] = false;
    component['changeValueWidth'] = false;
    component['updateDimensions']();
    expect(component['height']).toEqual('10');
    expect(component['width']).toEqual('10');
  });

});
