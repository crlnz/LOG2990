/* tslint:disable */
import { HttpClientModule } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { EraserService } from 'src/app/services/eraser/eraser.service';
import { FormService } from 'src/app/services/form/form.service';
import { IconService } from 'src/app/services/Icon/icon.service';
import { PipetteService } from 'src/app/services/pipette/pipette.service';
import { SelectionService } from 'src/app/services/selection/selection.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { TestingImportsModule } from '../../testing-imports/testing-imports';
import { ColorPaletteComponent } from '../color-tools/color-palette/color-palette.component';
import { ColorPickerComponent } from '../color-tools/color-picker/color-picker.component';
import { ColorSelectorComponent } from '../color-tools/color-selector/color-selector.component';
import { CreateDrawingModalComponent } from '../create-drawing/create-drawing.component';
import { DrawingSurfaceComponent } from '../drawing-surface/drawing-surface.component';
import { GridComponent } from '../drawing-surface/grid/grid.component';
import { ExportDrawingComponent } from '../export-drawing/export-drawing.component';
import { ModalWindowComponent, ModalWindowContentComponent, } from '../modal-window/modal-window.component';
import { ModalTestImportsModule } from '../modal-window/modalTestImport';
import { OpenDrawingComponent } from '../open-drawing/open-drawing.component';
import { SanitizeHtmlPipe } from '../open-drawing/sanitizeHtml.pipe';
import { SaveDrawingComponent } from '../save-drawing/save-drawing.component';
import { DrawingToolAttributesComponent } from '../toolbar/attributes-drawing-tool/attributes-drawing-tool.component';
import { AttributesEraserComponent } from '../toolbar/attributes-eraser/attributes-eraser.component';
import SpyObj = jasmine.SpyObj;
import { AttributesPanelComponent } from '../toolbar/attributes-panel/attributes-panel.component';
import { AttributesSelectComponent } from '../toolbar/attributes-select/attributes-select.component';
import { ShapeAttributesComponent } from '../toolbar/attributes-shapes/attributes-shapes.component';
import { AttributesStampComponent } from '../toolbar/attributes-stamp/attributes-stamp.component';
import { AttributesTextComponent } from '../toolbar/attributes-text/attributes-text.component';
import { GridOptionsComponent } from '../toolbar/grid-options/grid-options.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { UserGuideComponent } from '../user-guide/user-guide.component';
import { AppComponent } from './app.component';
import { PaintBucketService } from 'src/app/services/paintBucket/paint-bucket.service';
import { ManipulationService } from 'src/app/services/manipulation/manipulation.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { ColorService } from 'src/app/services/color/color.service';
import { AttributesPaintBucketComponent } from '../toolbar/attributes-paint-bucket/attributes-paint-bucket.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let spy: any;
  const event: Event = new Event('resized');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, TestingImportsModule, ModalTestImportsModule],
      declarations: [AppComponent, AttributesPanelComponent, DrawingSurfaceComponent, ModalWindowComponent, ToolbarComponent,
        CreateDrawingModalComponent, ModalWindowContentComponent, ColorPickerComponent, ShapeAttributesComponent,
        DrawingToolAttributesComponent, UserGuideComponent, ColorPaletteComponent, ColorSelectorComponent, GridOptionsComponent,
        GridComponent, SaveDrawingComponent, OpenDrawingComponent, SanitizeHtmlPipe, AttributesSelectComponent, AttributesStampComponent,
        AttributesTextComponent, AttributesEraserComponent, ExportDrawingComponent, AttributesPaintBucketComponent],
      providers: [{ provide: IconService },{ provide: GridService }, AppComponent],
    });
    const iconService = new IconService();
    const form = new FormService();
    const tool = new ToolsService();
    const gridService=new GridService();
    const manipulationService = new ManipulationService(gridService);
    const select = new SelectionService(manipulationService);
    const pipette = TestBed.get(PipetteService);
    const drawing = new DrawingService();
    const colorService=new ColorService();
    const paintBucketService = new PaintBucketService(colorService,drawing);
    const shortcut = TestBed.get(ShortcutsService);
    const eraser = TestBed.get(EraserService);
    component = new AppComponent(iconService, form, tool, select, pipette, drawing, shortcut, eraser, paintBucketService,manipulationService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should emit 'drawingResized' method on formService`, () => {
    spy = spyOn(component, 'getDimensions');
    component.getDimensions(event);
    expect(spy).toHaveBeenCalled();
  });

  it(`should toggle showAttributes Panel`, () => {
    component['showAttributesPanel'] = true;
    component.toggleAttributesPanel();
    expect(component['showAttributesPanel']).toBe(false);
  });

});
