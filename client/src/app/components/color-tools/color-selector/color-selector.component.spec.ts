/* tslint:disable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingToolService } from 'src/app/services/drawing-tools/drawing-tools.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { IconService } from 'src/app/services/Icon/icon.service';
import { SelectionService } from 'src/app/services/selection/selection.service';
import { ShapeService } from 'src/app/services/shape/shape.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { StampService } from 'src/app/services/stamp/stamp.service';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { TestingImportsModule } from '../../../testing-imports/testing-imports';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { ColorSelectorComponent } from './color-selector.component';
import { ManipulationService } from 'src/app/services/manipulation/manipulation.service';

describe('ColorSelectorComponent', () => {
  let component: ColorSelectorComponent;
  let fixture: ComponentFixture<ColorSelectorComponent>;
  let colorService: ColorService;
  let dialog: MatDialog;
  let shortcutsService: ShortcutsService;
  let drawingToolService: DrawingToolService;

  let toolService: ToolsService;
  let shapeService: ShapeService;
  let gridService: GridService;
  let stampService: StampService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorSelectorComponent, ColorPickerComponent, ColorPaletteComponent],
      imports: [TestingImportsModule],
      providers: [ColorService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    drawingToolService = new DrawingToolService();
    const iconService = new IconService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    colorService = new ColorService();
    stampService = new StampService();
    const drawingService = new DrawingService();
    const shortcutService = new ShortcutsService(shapeService, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    fixture = TestBed.createComponent(ColorSelectorComponent);
    component = fixture.componentInstance;
    component = new ColorSelectorComponent(dialog, colorService, shortcutsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
