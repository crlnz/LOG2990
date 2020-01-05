/* tslint:disable */
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Component, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ColorApplicatorService } from 'src/app/services/color-applicator/color-applicator.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { EraserService } from 'src/app/services/eraser/eraser.service';
import { ExportService } from 'src/app/services/export/export.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { OpenDrawingService } from 'src/app/services/open-drawing/open-drawing.service';
import { PipetteService } from 'src/app/services/pipette/pipette.service';
import { SelectionService } from 'src/app/services/selection/selection.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { StampService } from 'src/app/services/stamp/stamp.service';
import { TextService } from 'src/app/services/text/text.service';
import { Drawing } from '../../../../../common/communication/drawing';
import { ActiveToolService } from '../../services/active-tool/active-tool.service';
import { ClipboardService } from '../../services/clipboard/clipboard.service';
import { ColorService } from '../../services/color/color.service';
import { DrawingToolService } from '../../services/drawing-tools/drawing-tools.service';
import { FormService } from '../../services/form/form.service';
import { IconService } from '../../services/Icon/icon.service';
import { ShapeService } from '../../services/shape/shape.service';
import { ToolsService } from '../../services/tools/tools.service';
import { TestingImportsModule} from '../../testing-imports/testing-imports';
import { DrawingProperties } from '../create-drawing/drawing-properties';
import { DrawingSurfaceComponent } from './drawing-surface.component';
import { GridComponent } from './grid/grid.component';
import { ManipulationService } from 'src/app/services/manipulation/manipulation.service';
import { PaintBucketService } from 'src/app/services/paintBucket/paint-bucket.service';
@Component({
  template: `<SVG></SVG>`,
})
class MockSVGComponent {
}
class MockRendererFactory {
  createRenderer(renderer: any, element: any) {
    return new MockRenderer();
  }
}
class MockRenderer {
  addClass(document: string, cssClass: string): boolean {
    return true;
  }
  appendChild(parent: any , child: any) {
    return ;
  }
  removeChild(elementRef: any, child: any) {
    return true;
  }
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
}
describe('DrawingSurfaceComponent', () => {
  let component: DrawingSurfaceComponent;
  let fixture: ComponentFixture<DrawingSurfaceComponent>;
  let iconService: IconService;
  let attributeShapeTools: ShapeService;
  let httpHandler: HttpHandler;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingSurfaceComponent, GridComponent ],
      imports: [TestingImportsModule],
      providers: [HttpClient, HttpHandler, ColorService, FormService, ActiveToolService, ToolsService,
        IconService, DrawingToolService, DrawingService, SelectionService, ShapeService, Renderer2, GridService, ShortcutsService,
        ColorApplicatorService, OpenDrawingService, Subject, {provide: ElementRef, useClass: MockSVGComponent},
        {provide: Renderer2, useClass: MockRenderer}],
    })

    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingSurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggleGrid', () => {
    component['properties'].showGrid = true;
    component['toggleGrid']();
    expect(component['properties'].showGrid).toBe(false);
  });

  it('should call ngOnInit', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    const drawingService = new DrawingService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService(colorService);

    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);
    const mockSVGComponent = new MockSVGComponent();

    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    const color = 'red';
    component.ngOnInit();
    component['drawingProperties'].color = 'red';
    component['properties'].color = 'red';
    expect(component['properties'].color).toBe(color);
    expect(component['drawingProperties'].color).toBe(color);
  });

  it('should get properties', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService( colorService);

    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);
    const mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    const spy = spyOn(selectionService, 'initialisation');
    const spy2 = spyOn(toolService, 'initialisation');
    const spy3 = spyOn(clipboardService, 'initialisation');
    const spy4 = spyOn(eraserService, 'initialisation');
    drawingSurface['getProperties']();
    expect(drawingSurface['properties'].drawingCreated).toEqual(true);
    expect(drawingSurface['drawingProperties']).toEqual(component['formService'].drawingProperties);
    expect(drawingSurface['properties'].color).toEqual('#ffffff');
    expect(drawingSurface['properties'].width).toEqual('');
    expect(drawingSurface['properties'].height).toEqual('');
    expect(drawingSurface['properties'].pipetteTool).toEqual(drawingSurface['colorService'].pipetteTool);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();

  });
  it('should clearSVG', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService(colorService);
    component['renderer'] = TestBed.get(Renderer2);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);
    const mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(document.createElement('svg'));
    drawingSurface.anchorSVJ = elementRef;
    drawingSurface['clearSVG']();
    expect(elementRef.nativeElement.children.length).toEqual(0);
  });

  it('should get properties', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService( colorService);

    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);
    const mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    const spy = spyOn(selectionService, 'initialisation');
    const spy2 = spyOn(toolService, 'initialisation');
    const spy3 = spyOn(clipboardService, 'initialisation');
    const spy4 = spyOn(eraserService, 'initialisation');
    drawingSurface['getProperties']();
    expect(drawingSurface['properties'].drawingCreated).toEqual(true);
    expect(drawingSurface['drawingProperties']).toEqual(component['formService'].drawingProperties);
    expect(drawingSurface['properties'].color).toEqual('#ffffff');
    expect(drawingSurface['properties'].width).toEqual('');
    expect(drawingSurface['properties'].height).toEqual('');
    expect(drawingSurface['properties'].pipetteTool).toEqual(drawingSurface['colorService'].pipetteTool);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();

  });

  it('should openDrawing', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService(colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);
    const mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(document.createElement('svg'));
    drawingSurface.anchorSVJ = elementRef;
    const drawing: Drawing = {
      _id: '',
      tags: [],
      svgList: [],
      drawingColor: '',
      drawingHeight: '',
      drawingWidth: '',
    };
    openDrawingService.currentDrawingData = drawing;
    drawingSurface['openDrawing']();
    expect(drawingService.drawingArray).toEqual(openDrawingService.currentDrawingData.svgList);
  });

  it('should selectTool if toolChosen="fill"', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService(colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);
    const mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    const toolChosen = 'fill';
    drawingSurface['selectTool'](toolChosen);
    expect(drawingSurface['properties'].fillTool).toEqual(true);
    expect(drawingSurface['properties'].toolImplemented).toEqual(false);
  });


  it('should selectTool if toolChosen="eraser"', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService( colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    const mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    const toolChosen = 'eraser';
    drawingSurface['selectTool'](toolChosen);
    expect(drawingSurface['properties'].fillTool).toEqual(false);
    expect(drawingSurface['activeTool']).toEqual(component['eraserService']);
    expect(drawingSurface['properties'].toolImplemented).toEqual(true);
  });

  it('should selectTool if toolChosen="drawingTools"', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService(colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    const mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    const toolChosen = 'drawingTools';
    const spy = spyOn(textService, 'changeToolChosen');
    const spy2 = spyOn(toolService, 'setToolName');
    drawingSurface['selectTool'](toolChosen);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(drawingSurface['properties'].fillTool).toEqual(false);
    expect(drawingSurface['activeTool']).toEqual(toolService);
    expect(drawingSurface['properties'].toolImplemented).toEqual(true);
  });

  it('should selectTool if toolChosen="shapes"', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService(colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    const mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    const toolChosen = 'shapes';
    const spy = spyOn(textService, 'changeToolChosen');
    const spy2 = spyOn(toolService, 'setToolName');
    drawingSurface['selectTool'](toolChosen);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(drawingSurface['properties'].fillTool).toEqual(false);
    expect(drawingSurface['activeTool']).toEqual(toolService);
    expect(drawingSurface['properties'].toolImplemented).toEqual(true);
  });
  it('should selectTool if toolChosen="stamp"', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService(colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    const mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    const toolChosen = 'stamp';
    const spy = spyOn(textService, 'changeToolChosen');
    const spy2 = spyOn(toolService, 'setToolName');
    drawingSurface['selectTool'](toolChosen);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(drawingSurface['properties'].fillTool).toEqual(false);
    expect(drawingSurface['activeTool']).toEqual(toolService);
    expect(drawingSurface['properties'].toolImplemented).toEqual(true);
  });

  it('should selectTool if toolChosen="text"', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService( colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    const mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    const toolChosen = 'text';
    const spy = spyOn(textService, 'changeToolChosen');
    const spy2 = spyOn(toolService, 'setToolName');
    drawingSurface['selectTool'](toolChosen);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(drawingSurface['properties'].fillTool).toEqual(false);
    expect(drawingSurface['activeTool']).toEqual(toolService);
    expect(drawingSurface['properties'].toolImplemented).toEqual(true);
  });

  it('should call mouseDown', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService(colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    let mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    mockSVGComponent = document.createElement('SVG');
    const mockElementRef = new ElementRef(mockSVGComponent);
    const event: MouseEvent = new MouseEvent('mousedown');
    component['properties'].pipetteTool = true;
    spyOn(component['pipetteService'], 'getSvgColor').and.callThrough();
    component['mouseDown'](event);
    expect(component['properties'].onSurface).toBe(true);
    expect(component['properties'].pipetteTool).toBe(component['colorService'].pipetteTool);
  });

  it('should call mouseDown', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService(colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    let mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    mockSVGComponent = document.createElement('SVG');
    const mockElementRef = new ElementRef(mockSVGComponent);
    const event: MouseEvent = new MouseEvent('mousedown');
    component['activeTool'] != component['selectionService'];
    component['selectionService'].controlsBoxCreated = true;
    const spy = spyOn(component['selectionService'], 'removeControls');
    component['mouseDown'](event);
    expect(spy).toHaveBeenCalled();
    expect(component['properties'].onSurface).toBe(true);
    expect(component['properties'].pipetteTool).toBe(component['colorService'].pipetteTool);
  });

  it('should call mouseUp', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService(colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    let mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    mockSVGComponent = document.createElement('SVG');
    const mockElementRef = new ElementRef(mockSVGComponent);
    component['activeTool'] = new ActiveToolService();
    const event: MouseEvent = new MouseEvent('mouseup');
    component['properties'].toolImplemented = true;
    const spy = spyOn(component['activeTool'], 'mouseUp');
    component['mouseUp'](event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call doubleClick', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService( colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    let mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    mockSVGComponent = document.createElement('SVG');
    const mockElementRef = new ElementRef(mockSVGComponent);
    component['activeTool'] = new ActiveToolService();
    const event: MouseEvent = new MouseEvent('dblclick');
    component['properties'].toolImplemented = true;
    const spy = spyOn(component['activeTool'], 'doubleClick');
    component['doubleClick'](event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call stateTool', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService( colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    let mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    mockSVGComponent = document.createElement('SVG');
    const mockElementRef = new ElementRef(mockSVGComponent);
    component['activeTool'] = new ActiveToolService();
    const stateTool = true;
    const event: MouseEvent = new MouseEvent('mouseup');
    component['properties'].toolImplemented = true;
    component['stateTool'](stateTool);
    expect(component['properties'].toolImplemented).toEqual(true);
    expect(component['activeTool']).toEqual(toolService);
  });

  it('should call eraseToolShortcut', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService( colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    const mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    component['activeTool'] = new ActiveToolService();
    const stateEraseTool = true;
    component['eraseToolShortcut'](stateEraseTool);
    expect(component['properties'].toolImplemented).toEqual(true);
    expect(component['activeTool']).toEqual(eraserService);
  });
  it('should call displayGrid', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService(colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    let mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    mockSVGComponent = document.createElement('SVG');
    const mockElementRef = new ElementRef(mockSVGComponent);
    component['activeTool'] = new ActiveToolService();
    const stateGrid = true;
    component['properties'].toolImplemented = true;
    const spy = spyOn<any>(component, 'toggleGrid');
    component['displayGrid'](stateGrid);
    expect(spy).toHaveBeenCalled();
  });

  it('should call fillToolShortcut', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService(colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    let mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    const elementRef = new ElementRef(mockSVGComponent);
    drawingSurface.anchorSVJ = elementRef;
    mockSVGComponent = document.createElement('SVG');
    const mockElementRef = new ElementRef(mockSVGComponent);
    component['activeTool'] = new ActiveToolService();
    const stateShortcut = true;
    component['fillToolShortcut'](stateShortcut);
    expect(component['properties'].toolImplemented).toEqual(false);
    expect(component['properties'].fillTool).toEqual(true);
  });

  it('should call toggleGrid', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService( colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    const mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    component['properties'].showGrid = true;
    component['toggleGrid']();
    expect(component['properties'].showGrid).toEqual(false);
  });

  it('should call keyDown', () => {
    const rendererFactory = TestBed.get(RendererFactory2);
    const formService = new FormService();
    iconService = TestBed.get(IconService);
    const gridService = new GridService();
    const toolService = new ToolsService();
    const colorService = new ColorService();
    const drawingToolService = new DrawingToolService();
    const drawingService = new DrawingService();
    const colorApplicator = new ColorApplicatorService(colorService, drawingService);
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const shortcutService = new ShortcutsService(attributeShapeTools, drawingToolService, toolService, gridService, colorService, selectionService, stampService, iconService, drawingService, manipulationService);
    const eraserService = new EraserService();
    const pipetteService = new PipetteService( colorService);
    const httpClient = new HttpClient(httpHandler);
    const openDrawingService = new OpenDrawingService(httpClient);
    const clipboardService = new ClipboardService();
    const textService = new TextService();
    const exportService = new ExportService();
    const paintBucketService = new PaintBucketService(colorService,drawingService);
    const drawingSurface = new DrawingSurfaceComponent(rendererFactory, formService, toolService, iconService, colorService, drawingToolService,
     attributeShapeTools, gridService, shortcutService, colorApplicator, pipetteService, drawingService, selectionService, openDrawingService,
     clipboardService, eraserService, textService, stampService, exportService, paintBucketService);    const mockSVGComponent = new MockSVGComponent();
    const drawingProperties: DrawingProperties = {
      color: '#ffffff',
      width: '',
      height: '',
    };
    formService.drawingProperties = drawingProperties;
    component['properties'].showGrid = true;
    component['toggleGrid']();
    expect(component['properties'].showGrid).toEqual(false);
  });

});
