/* tslint:disable */

import { TestBed } from '@angular/core/testing';
import { Component, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { LineComponent } from 'src/app/components/drawing-tools/line/line.component';
import { PencilComponent } from 'src/app/components/drawing-tools/pencil/pencil.component';
import { StampComponent } from 'src/app/components/stamp/stamp.component';
import { EllipseComponent } from 'src/app/components/shape-tools/ellipse/ellipse.component';
import { PolygonComponent } from 'src/app/components/shape-tools/polygon/polygon.component';
import { RectangleComponent } from 'src/app/components/shape-tools/rectangle/rectangle.component';
import { ColorPaletteComponent } from '../../components/color-tools/color-palette/color-palette.component';
import { ColorPickerComponent } from '../../components/color-tools/color-picker/color-picker.component';
import { ColorSelectorComponent } from '../../components/color-tools/color-selector/color-selector.component';
import { PaintbrushComponent } from '../../components/drawing-tools/paintbrush/paintbrush.component';
import { TestingImportsModule } from '../../testing-imports/testing-imports';
import { ColorService } from '../color/color.service';
import { DrawingToolService } from '../drawing-tools/drawing-tools.service';
import { DrawingService } from '../drawing/drawing.service';
import { ShapeService } from '../shape/shape.service';
import { TextService } from '../text/text.service';
import { Color, Final, Initial, Tools, ToolChosen } from './tool-properties';
import { ToolsService } from './tools.service';
import { ShortcutsService } from '../shortcuts/shortcuts.service';
import { GridService } from '../grid/grid.service';
import { SelectionService } from '../selection/selection.service';
import { StampService } from '../stamp/stamp.service';
import { TextComponent } from 'src/app/components/text/text.component';
import { PenComponent } from 'src/app/components/drawing-tools/pen/pen.component';
import { IconService } from '../Icon/icon.service';
import { ManipulationService } from '../manipulation/manipulation.service';
import { BehaviorSubject } from 'rxjs';

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
  appendChild(parent: any, child: any) {
    return;
  }
  removeChild(elementRef: any, child: any) {
    return true;
  }
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  createElement(element: any) {
    return document.createElement("canvas");
  }
}

describe('ToolsService', () => {
  let rendererFactory: jasmine.SpyObj<RendererFactory2>;
  
  rendererFactory = jasmine.createSpyObj('rendererFactory', ['createRenderer', 'removeClass', 'setStyle']);
  beforeEach(() => TestBed.configureTestingModule({

    declarations: [ColorSelectorComponent, ColorPickerComponent, ColorPaletteComponent],
    providers: [{ provide: ElementRef, useClass: MockSVGComponent },
    { provide: Renderer2, useClass: MockRenderer }, { provide: RendererFactory2, useClass: MockRendererFactory },
      PaintbrushComponent, ColorService, DrawingToolService, ShapeService, DrawingService],
    imports: [TestingImportsModule],
  }));
 
  it('should be created', () => {
    const service: ToolsService = new ToolsService();
    expect(service).toBeTruthy();
  });


  it('should call the setToolName method and return the correct toolName', () => {
    const toolName = 'abc';
    const service = new ToolsService();
    service.setToolName(toolName);
    expect(service['properties'].toolName).toEqual(toolName);
  });

  it('should call the initialisation method and return the correct values', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);

    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
    expect(service['rendererFactory']).toEqual(rendererFactory);
    expect(service['colorService']).toEqual(colorService);
    expect(service['drawingService']).toEqual(drawingService);
    expect(service['attributesDrawingTools']).toEqual(attributesDrawingTools);
    expect(service['attributeShapeTools']).toEqual(attributeShapeTools);

    expect(service['renderer']).toEqual(service['rendererFactory'].createRenderer(null, null));
    expect(service['tools'].rectangleTool).toEqual(new RectangleComponent(service['renderer'], service['anchorSVJ'], drawingService));
    expect(service['tools'].pencilTool).toEqual(new PencilComponent (service['renderer'], service['anchorSVJ'], service['drawingService']));
    expect(service['tools'].paintbrushTool).toEqual(new PaintbrushComponent(service['renderer'], service['anchorSVJ'], service['drawingService']));
    expect(service['tools'].ellipseTool).toEqual( new EllipseComponent(service['renderer'], service['anchorSVJ'], service['drawingService']));
    expect(service['tools'].lineTool).toEqual(new LineComponent( service['renderer'], service['anchorSVJ'], service['drawingService']));
    expect(service['tools'].stampTool).toEqual(new StampComponent(service['renderer'], service['anchorSVJ'], service['drawingService'],service['stampService']));
    expect(service['tools'].polygonTool).toEqual(new PolygonComponent(service['renderer'], service['anchorSVJ'], service['drawingService']));
  });

  it('should call the toolAttributes method and return the correct values if toolName is shapes', () => {
    const colorService = new ColorService();
    const service = new ToolsService();
    service['colorService'] = new ColorService();
    service['attributesDrawingTools'] = new DrawingToolService();
    service['attributeShapeTools'] = new ShapeService();
    service['color'] = {secondaryColor: 'red', primaryColor: 'blue'};
    colorService.sendPrimaryColor('blue');
    colorService.sendSecondaryColor('red');
    service['properties'].toolName = 'shapes';
    service.toolAttributes();
    service['color'] = { secondaryColor: 'red', primaryColor: 'blue' };
    expect(service['color'].primaryColor).toEqual('blue');
    expect(service['color'].secondaryColor).toEqual('red');
    expect(service['properties'].width).toEqual(service['attributeShapeTools'].strokeWidth);
    expect(service['properties'].toolChosen).toEqual(service['attributeShapeTools'].shape);
    expect(service['properties'].typeChosen).toEqual(service['attributeShapeTools'].type);
    expect(service['properties'].nbOfPoints).toEqual(service['attributeShapeTools'].nbPoints);
  });



  it('should return the correct chosen tool', () => {
    const service = new ToolsService();
    const testTool = 'testTool';
    service['properties'].toolChosen = testTool;
    spyOn(service, 'getToolChosen').and.callThrough();
    service.getToolChosen();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the removeNull method on case Tools.PAINTBRUSH', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);    
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Paintbrush';
    service['properties'].toolChosen = testTool;
    const paintbrush: PaintbrushComponent = new PaintbrushComponent(service['renderer'], service['anchorSVJ'], service['drawingService']);
    service['tools'].paintbrushTool = paintbrush;
    spyOn(service, 'chooseToolMouseUp').and.callThrough();
    spyOn(service['tools'].paintbrushTool, 'removeNull').and.callThrough();
    service.chooseToolMouseUp();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the removeNull method on case Tools.PENCIL', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Pencil';
    service['properties'].toolChosen = testTool;
    const pencil: PencilComponent = new PencilComponent(service['renderer'], service['anchorSVJ'], service['drawingService']);
    service['tools'].pencilTool = pencil;
    spyOn(service, 'chooseToolMouseUp').and.callThrough();
    spyOn(service['tools'].pencilTool, 'removeNull').and.callThrough();
    service.chooseToolMouseUp();
    expect(service['properties'].toolChosen).toBe(testTool);
  });


  it('should call the removeNull method on case Tools.POLYGON', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Polygon';
    service['properties'].toolChosen = testTool;
    const polygon: PolygonComponent = new PolygonComponent(service['renderer'], service['anchorSVJ'], service['drawingService']);
    service['tools'].polygonTool = polygon;
    spyOn(service, 'chooseToolMouseUp').and.callThrough();
    spyOn(service['tools'].polygonTool, 'removePreview').and.callThrough();
    service.chooseToolMouseUp();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the removeNull method on case Tools.ELLIPSE', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Ellipse';
    service['properties'].toolChosen = testTool;
    const ellipse: EllipseComponent = new EllipseComponent(service['renderer'], service['anchorSVJ'], service['drawingService']);
    service['tools'].ellipseTool = ellipse;
    spyOn(service, 'chooseToolMouseUp').and.callThrough();
    spyOn(service['tools'].ellipseTool, 'removePreview').and.callThrough();
    service.chooseToolMouseUp();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the removeNull method on case Tools.RECTANGLE', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Rectangle';
    service['properties'].toolChosen = testTool;
    const rect: RectangleComponent = new RectangleComponent(service['renderer'], service['anchorSVJ'], service['drawingService']);
    service['tools'].rectangleTool = rect;
    spyOn(service, 'chooseToolMouseUp').and.callThrough();
    spyOn(service['tools'].rectangleTool, 'removeNull').and.callThrough();
    service.chooseToolMouseUp();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the currentPosition method on case Tools.LINE', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool: string = Tools.LINE;
    service['properties'].toolChosen = testTool;
    const line: LineComponent = new LineComponent(service['renderer'], service['anchorSVJ'], service['drawingService']);
    service['tools'].lineTool = line;
    const final: Final = {
      x2: 1,
      y2: 1,
    };
    service['properties'].escKeyOn = true;
    service['coordFinal'] = final;
    spyOn(service, 'chooseToolMouseMove').and.callThrough();
    spyOn(service['tools'].lineTool, 'currentPosition').and.callThrough();
    service.chooseToolMouseMove();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the drawPolygon method on case Tools.POLYGON', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool: string = "Polygon";
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2)
    const polygon: PolygonComponent = new PolygonComponent(renderer, elementRef, service['drawingService']);
    service['tools'].polygonTool = polygon;
    const final: Final = {
      x2: 1,
      y2: 1,
    };
    const init: Initial = {
      x1: 5,
      y1: 5,
    };
    service['coordInit'] = init;
    service['coordFinal'] = final;
    service['properties'].nbOfPoints = 5;
    service['properties'].drag = true;
    service['tools'].polygonTool.createPolygon('#eb4034', '#eb4034', 1, 'Ellipse');
    spyOn(service, 'chooseToolMouseMove').and.callThrough();
    spyOn(service['tools'].polygonTool, 'drawPolygon').and.callThrough();
    service['properties'].drag = true;
    service['tools'].polygonTool.createPolygon('#eb4034', '#eb4034', 1, 'Ellipse');
    service.chooseToolMouseMove();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the drawPaintbrush method on case Tools.PAINTBRUSH', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Paintbrush';
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const paintbrush: PaintbrushComponent = new PaintbrushComponent(renderer, elementRef, service['drawingService']);
    service['tools'].paintbrushTool = paintbrush;
    const final: Final = {
      x2: 1,
      y2: 1,
    };
    const init: Initial = {
      x1: 5,
      y1: 5,
    };
    service['coordInit'] = init;
    service['coordFinal'] = final;
    spyOn(service, 'chooseToolMouseMove').and.callThrough();
    spyOn(service['tools'].paintbrushTool, 'drawPaintbrush').and.callThrough();
    service['properties'].drag = true;
    service['tools'].paintbrushTool.createPaintbrush(1, 1, 'red', 1, service['tools'].paintbrushTool['texture']);
    service.chooseToolMouseMove();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the drawPencil method on case Tools.PENCIL', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Pencil';
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const pencil: PencilComponent = new PencilComponent(renderer, elementRef, service['drawingService']);
    service['tools'].pencilTool = pencil;
    const final: Final = {
      x2: 1,
      y2: 1,
    };
    const init: Initial = {
      x1: 5,
      y1: 5,
    };
    service['coordInit'] = init;
    service['coordFinal'] = final;
    spyOn(service, 'chooseToolMouseMove').and.callThrough();
    spyOn(service['tools'].pencilTool, 'drawPencil').and.callThrough();
    service['properties'].drag = true;
    service['tools'].pencilTool.createPath(1, 1, 1, 'red');
    service.chooseToolMouseMove();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the drawRectangle method on case Tools.RECTANGLE', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Rectangle';
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const rect: RectangleComponent = new RectangleComponent(renderer, elementRef, service['drawingService']);
    service['tools'].rectangleTool = rect;
    const final: Final = {
      x2: 1,
      y2: 1,
    };
    const init: Initial = {
      x1: 5,
      y1: 5,
    };
    service['event'] = new MouseEvent('mousemove', {
      shiftKey: true,
    });
    service['coordInit'] = init;
    service['coordFinal'] = final;
    spyOn(service, 'chooseToolMouseMove').and.callThrough();
    spyOn(service['tools'].rectangleTool, 'drawRectangle').and.callThrough();
    service['properties'].drag = true;
    service['tools'].rectangleTool.createRectangle('#eb4034', '#eb4034', 1, 'Rectangle');
    service.chooseToolMouseMove();
    expect(service['properties'].toolChosen).toBe(testTool);
  });
  
  it('should call the drawEllipse method on case Tools.Ellipse', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();

    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Ellipse';
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const ellipse: EllipseComponent = new EllipseComponent(renderer, elementRef, service['drawingService']);
    service['tools'].ellipseTool = ellipse;
    const final: Final = {
      x2: 1,
      y2: 1,
    };
    const init: Initial = {
      x1: 5,
      y1: 5,
    };
    service['event'] = new MouseEvent('mousemove', {
      shiftKey: true,
    });
    service['coordInit'] = init;
    service['coordFinal'] = final;
    spyOn(service, 'chooseToolMouseMove').and.callThrough();
    spyOn(service['tools'].ellipseTool, 'drawEllipse').and.callThrough();
    service['properties'].drag = true;
    service['tools'].ellipseTool.createEllipse('#eb4034', '#eb4034', 1, 'Rectangle');
    service.chooseToolMouseMove();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the drawPen method on case Tools.PEN', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = Tools.PEN;
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const pen: PenComponent = new PenComponent(renderer, elementRef, service['drawingService']);
    service['tools'].pen = pen;
    const final: Final = {
      x2: 1,
      y2: 1,
    };
    const init: Initial = {
      x1: 5,
      y1: 5,
    };
    service['event'] = new MouseEvent('mousemove', {
      shiftKey: true,
    });
    service['properties'].drag = true;
    service['coordInit'] = init;
    service['coordFinal'] = final;
    service['properties'].maxTip = 1;
    service['properties'].minTip = 1;
    const max = service['properties'].maxTip;
    const min = service['properties'].minTip;
    spyOn(service, 'chooseToolMouseMove').and.callThrough();
    spyOn(service['tools'].pen, 'drawPen').and.callThrough();
    service['tools'].pen.createPath(1, 1, 'red', max , min,1);
    service.chooseToolMouseMove();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the createPolygon method on case Tools.POLYGON', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Polygon';
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const polygon: PolygonComponent = new PolygonComponent(renderer, elementRef, service['drawingService']);
    service['tools'].polygonTool = polygon;
    const color: Color = {
      primaryColor: 'red',
      secondaryColor: 'red',
    };
    service['color'] = color;
    spyOn(service, 'chooseToolMouseDown').and.callThrough();
    spyOn(service['tools'].polygonTool, 'createPolygon').and.callThrough();
    service.chooseToolMouseDown();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the createPath method  on case Tools.STAMP', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Stamp';
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const stamp: StampComponent = new StampComponent(renderer, elementRef, drawingService,stampService);
    service['tools'].stampTool = stamp;
    const init: Initial = {
      x1: 5,
      y1: 5,
    };
    service['coordInit'] = init;
    service['properties'].width = 1;
    service['properties'].scale = 1;
    service['properties'].stamp = '';
    spyOn(service, 'chooseToolMouseDown').and.callThrough();
    spyOn(service['tools'].stampTool, 'createPath').and.callThrough();
    service.chooseToolMouseDown();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the createPath method  on case Tools.LINE', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();

    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool: string = Tools.LINE;
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const line: LineComponent = new LineComponent(renderer, elementRef, service['drawingService']);
    service['tools'].lineTool = line;
    const init: Initial = {
      x1: 1,
      y1: 1,
    };
    const color: Color = {
      primaryColor: 'red',
      secondaryColor: 'red',
    };
    service['coordInit'] = init;
    service['color'] = color;
    service['properties'].width = 1;
    service['properties'].scale = 1;
    service['properties'].pattern = '';
    service['properties'].diameter = 1;
    spyOn(service, 'chooseToolMouseDown').and.callThrough();
    spyOn(service['tools'].lineTool, 'createPath').and.callThrough();
    service.chooseToolMouseDown();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the createEllipse method  on case Tools.ELLIPSE', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);    
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Ellipse';
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const ellipse: EllipseComponent = new EllipseComponent(renderer, elementRef, service['drawingService']);
    service['tools'].ellipseTool = ellipse;
    const init: Initial = {
      x1: 1,
      y1: 1,
    };
    const color: Color = {
      primaryColor: 'red',
      secondaryColor: 'red',
    };
    service['coordInit'] = init;
    service['color'] = color;
    service['properties'].width = 1;
    service['properties'].typeChosen = 'Fill';
    spyOn(service, 'chooseToolMouseDown').and.callThrough();
    spyOn(service['tools'].ellipseTool, 'createEllipse').and.callThrough();
    service.chooseToolMouseDown();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the createPath method  on case Tools.PENCIL', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Pencil';
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const pencil: PencilComponent = new PencilComponent(renderer, elementRef, service['drawingService']);
    service['tools'].pencilTool = pencil;
    const init: Initial = {
      x1: 1,
      y1: 1,
    };
    const color: Color = {
      primaryColor: 'red',
      secondaryColor: 'red',
    };
    service['coordInit'] = init;
    service['color'] = color;
    service['properties'].width = 1;
    spyOn(service, 'chooseToolMouseDown').and.callThrough();
    spyOn(service['tools'].pencilTool, 'createPath').and.callThrough();
    service.chooseToolMouseDown();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the createPath method  on case Tools.PEN', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = Tools.PEN;
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const pen: PenComponent = new PenComponent(renderer, elementRef, service['drawingService']);
    service['tools'].pen = pen;
    const init: Initial = {
      x1: 1,
      y1: 1,
    };
    const color: Color = {
      primaryColor: 'red',
      secondaryColor: 'red',
    };
    service['coordInit'] = init;
    service['color'] = color;
    service['properties'].width = 1;
    service['properties'].maxTip = 1;
    service['properties'].minTip = 1;
    spyOn(service, 'chooseToolMouseDown').and.callThrough();
    spyOn(service['tools'].pen, 'createPath').and.callThrough();
    service.chooseToolMouseDown();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the createPaintbrush method  on case Tools.PAINTBRUSH', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Paintbrush';
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const paintbrush: PaintbrushComponent = new PaintbrushComponent(renderer, elementRef, service['drawingService']);
    service['tools'].paintbrushTool = paintbrush;
    const init: Initial = {
      x1: 1,
      y1: 1,
    };
    const color: Color = {
      primaryColor: 'red',
      secondaryColor: 'red',
    };
    service['coordInit'] = init;
    service['color'] = color;
    service['properties'].width = 1;
    service['properties'].texture = '';
    spyOn(service, 'chooseToolMouseDown').and.callThrough();
    spyOn(service['tools'].paintbrushTool, 'createPaintbrush').and.callThrough();
    service.chooseToolMouseDown();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the createRectangle method  on case Tools.RECTANGLE', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = 'Rectangle';
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const rect: RectangleComponent = new RectangleComponent(renderer, elementRef, service['drawingService']);
    service['tools'].rectangleTool = rect;
    const init: Initial = {
      x1: 1,
      y1: 1,
    };
    const color: Color = {
      primaryColor: 'red',
      secondaryColor: 'red',
    };
    service['coordInit'] = init;
    service['color'] = color;
    service['properties'].width = 1;
    service['properties'].typeChosen = 'Fill';
    spyOn(service, 'chooseToolMouseDown').and.callThrough();
    spyOn(service['tools'].rectangleTool, 'createRectangle').and.callThrough();
    service.chooseToolMouseDown();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the write method  on case Tools.TEXT', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool: string = Tools.TEXT;
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const text: TextComponent = new TextComponent(renderer, elementRef, service['drawingService'], textService, colorService);
    service['tools'].textTool = text;
    const init: Initial = {
      x1: 1,
      y1: 1,
    };
    const color: Color = {
      primaryColor: 'red',
      secondaryColor: 'red',
    };
    service['coordInit'] = init;
    service['color'] = color;
    service['properties'].bold = '';
    service['properties'].italic = '';
    service['properties'].alignment = '';
    service['properties'].textSize = 1;
    service['shortcutService'] = shortcutService;
    spyOn(service, 'chooseToolMouseDown').and.callThrough();
    spyOn(service['tools'].textTool, 'write').and.callThrough();
    service.chooseToolMouseDown();
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should call the removePoint method on Tools.LINE and backspace == TRUE', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);

    const testTool: string = Tools.LINE;
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const final: Final = {
      x2: 1,
      y2: 1,
    };
    const init: Initial = {
      x1: 5,
      y1: 5,
    };
    service['coordInit'] = init;
    service['coordFinal'] = final;
    const line: LineComponent = new LineComponent(renderer, elementRef, service['drawingService']);
    service['tools'].lineTool = line;
    spyOn(service, 'pointShortcuts').and.callThrough();
    spyOn(service['tools'].lineTool, 'removePoint').and.callThrough();
    service.pointShortcuts(true);
    expect(service['tools'].lineTool.removePoint).toHaveBeenCalled();
  });

  it('should call the currentPosition method on Tools.LINE and escKey == TRUE', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool: string = Tools.LINE;
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const line: LineComponent = new LineComponent(renderer, elementRef, service['drawingService']);
    service['tools'].lineTool = line;
    const final: Final = {
      x2: 1,
      y2: 1,
    };
    const init: Initial = {
      x1: 5,
      y1: 5,
    };
    service['coordInit'] = init;
    service['coordFinal'] = final;
    line['lineAttribs'].pointArray = [];
    spyOn(service, 'lineShortcuts').and.callThrough();
    spyOn(service['tools'].lineTool, 'currentPosition').and.callThrough();
    service.lineShortcuts(true);
    expect(service['properties'].escKeyOn).toBe(true);
  });

  it('should NOT call the currentPosition method on Tools.LINE and escKey == FALSE', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool: string = Tools.LINE;
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const line: LineComponent = new LineComponent(renderer, elementRef, service['drawingService']);
    service['tools'].lineTool = line;
    const final: Final = {
      x2: 1,
      y2: 1,
    };
    const init: Initial = {
      x1: 5,
      y1: 5,
    };
    service['coordInit'] = init;
    service['coordFinal'] = final;
    spyOn(service, 'lineShortcuts').and.callThrough();
    spyOn(service['tools'].lineTool, 'currentPosition').and.callThrough();
    service.lineShortcuts(false);
    expect(service['properties'].escKeyOn).toBe(false);
  });

  it('should stop drawing a line when the user double clicks', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool: string = Tools.LINE;
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const line: LineComponent = new LineComponent(renderer, elementRef, service['drawingService']);
    service['tools'].lineTool = line;
    const event: MouseEvent = new MouseEvent('dblclick');
    spyOn(service['tools'].lineTool, 'doubleClick').and.callThrough();
    spyOn(service['tools'].lineTool, 'removeNull').and.callThrough();
    service.doubleClick(event);
    expect(service['tools'].lineTool.doubleClick).toHaveBeenCalledWith(event);
    expect(service['tools'].lineTool.removeNull).toHaveBeenCalled();
    expect(service['properties'].dblClick).toBe(true);
  });

  
  it('should not call removePoint if backSpace == FALSE', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool: string = Tools.LINE;
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const line: LineComponent = new LineComponent(renderer, elementRef, service['drawingService']);
    service['tools'].lineTool = line;
    const final: Final = {
      x2: 1,
      y2: 1,
    };
    const init: Initial = {
      x1: 5,
      y1: 5,
    };
    service['coordInit'] = init;
    service['coordFinal'] = final;
    service['properties'].escKeyOn = false;
    spyOn(service, 'pointShortcuts').and.callThrough();
    spyOn(service['tools'].lineTool, 'currentPosition').and.callThrough();
    service.pointShortcuts(false);
    expect(service['tools'].lineTool.currentPosition).toHaveBeenCalledWith(final.x2, final.y2, service['properties'].escKeyOn);
  });

  it('should call chooseToolMouseUp on mouseUp', () => {
    const service = new ToolsService();
    const event: MouseEvent = new MouseEvent('mouseup');
    spyOn(service, 'mouseUp').and.callThrough();
    spyOn(service, 'chooseToolMouseUp').and.callThrough();
    service.mouseUp(event);
    expect(service['properties'].firstPoint).toBe(true);
    expect(service['properties'].drag).toBe(false);
  });

  it('should call switchCaseMouse on mouseMove', () => {
    const service = new ToolsService();
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOn(service, 'mouseMove').and.callThrough();
    spyOn(service, 'chooseToolMouseMove').and.callThrough();
    service.mouseMove(event);
    expect(service.chooseToolMouseMove).toHaveBeenCalled();
  });

  it('should call chooseToolMouseDown on mouseDown', () => {
    const service = new ToolsService();
    const event: MouseEvent = new MouseEvent('mousedown');
    service['colorService'] = new ColorService();
    spyOn(service, 'mouseDown').and.callThrough();
    spyOn(service, 'toolAttributes').and.callThrough();
    spyOn(service, 'chooseToolMouseDown').and.callThrough();
    service.mouseDown(event);
    expect(service['properties'].firstPoint).toBe(false);
    expect(service['properties'].drag).toBe(true);
  });

  it('should set the distance scrolled in X and Y', () => {
    const service = new ToolsService();
    service.setAmountScrolled(1, 1);
    expect(service['properties'].amountScrolledX).toBe(1);
    expect(service['properties'].amountScrolledY).toBe(1);
  });

  it('should set the toolbar width', () => {
    const service = new ToolsService();
    service.setToolbarWidth(1);
    expect(service['properties'].toolbarWidth).toBe(1);
  });

  it('should call the onKeyDown method for the text Tool', ()=>{
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool: string = Tools.TEXT;
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const text: TextComponent = new TextComponent(renderer, elementRef, service['drawingService'], textService, colorService);
    service['tools'].textTool = text;
    const event: KeyboardEvent = new KeyboardEvent('keydown', {code: 'KeyA'});
    spyOn(service, 'onKeyDown').and.callThrough();
    spyOn(service['tools'].textTool, 'onWritingText').and.callThrough();
    text['text'] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    service.onKeyDown(event);
    expect(text['textVariables'].acceptedKeys).toBe(true);
  });

  it('should set the display point boolean of the line component', ()=>{
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool: string = Tools.LINE;
    service['properties'].toolChosen = testTool;
    const renderer = TestBed.get(Renderer2);
    const line: LineComponent = new LineComponent(renderer, elementRef, service['drawingService']);
    service['tools'].lineTool = line;
    spyOn(service, 'displayPointForLine').and.callThrough();
    spyOn(service['tools'].lineTool, 'displayLineWithPoint').and.callThrough();
    service['properties'].displayPoint = false;
    service.displayPointForLine();
    expect(line['lineAttribs'].displayPoint).toBe(false);
  });

  it('should set the toolChosen', ()=>{
    const service = new ToolsService();
    const testTool = 'testTool';
    spyOn(service, 'setToolChosen').and.callThrough();
    service.setToolChosen(testTool);
    expect(service['properties'].toolChosen).toBe(testTool);
  });

  it('should set the stamp attributes', ()=>{
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService=new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService= new ToolsService();
    const gridService= new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService,
    attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
    const number= new BehaviorSubject<number>(1) ;
    service['stampService'].tool = 'test';
    service['stampService'].stamp = 'test';
    service['stampService'].scale = 1;
    service['stampService']['rotation'] = number;
    spyOn(service, 'stampAttributes').and.callThrough();
    service.stampAttributes();
    expect(service['properties'].toolChosen).toEqual('test');
    expect(service['properties'].stamp).toEqual('test');
    expect(service['properties'].scale).toEqual(1);
    //expect(service['properties'].rotate).toEqual(1);
  });

  it('should set the drawing tool attributes', ()=>{
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService=new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService= new ToolsService();
    const gridService= new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService,
    attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
    
    service['attributesDrawingTools'].texture = "";
    service['attributesDrawingTools'].strokeWidth = 1;
    service['attributesDrawingTools'].sendTool("");
    service['attributesDrawingTools'].pattern = "";
    service['attributesDrawingTools'].diameter = 1;
    service['attributesDrawingTools'].junction = "";
    service['attributesDrawingTools'].displayPoint = true;
    service['attributesDrawingTools'].maxTip = 1;
    service['attributesDrawingTools'].minTip = 1;
    spyOn(service, 'drawingToolAttributes').and.callThrough();
    service.drawingToolAttributes();
    expect(service['properties'].texture).toEqual("");
    expect(service['properties'].width).toEqual(1);
    expect(service['properties'].toolChosen).toEqual("");
    expect(service['properties'].pattern).toEqual("");
    expect(service['properties'].diameter).toEqual(1);
    expect(service['properties'].junctionType).toEqual("");
    expect(service['properties'].displayPoint).toBe(true);
    expect(service['properties'].maxTip).toEqual(1);
    expect(service['properties'].minTip).toEqual(1);
  });

  it('should call stampAttributes on stamp tool', ()=>{
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService=new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService= new ToolsService();
    const gridService= new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService,
    attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);

    service['properties'].toolName = ToolChosen.STAMP;
    spyOn(service, 'toolAttributes').and.callThrough();
    spyOn(service, 'stampAttributes').and.callThrough();
    service.toolAttributes();
    expect(service.stampAttributes).toHaveBeenCalled();
  });

  it('should call drawingToolAttributes on drawing tool', ()=>{
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService=new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService= new ToolsService();
    const gridService= new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService,
    attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);

    service['properties'].toolName = ToolChosen.DRAWING_TOOLS;
    spyOn(service, 'toolAttributes').and.callThrough();
    spyOn(service, 'drawingToolAttributes').and.callThrough();
    service.toolAttributes();
    expect(service.drawingToolAttributes).toHaveBeenCalled();
  });

  it('should call the removeNull method on case Tools.PEN', () => {
    const drawingService = new DrawingService();
    const attributeShapeTools = new ShapeService();
    const attributesDrawingTools = new DrawingToolService();
    const colorService = new ColorService();
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    const rendererFactory = TestBed.get(RendererFactory2);
    const service = new ToolsService();
    const textService = new TextService()
    const shapeService = new ShapeService();
    const drawingToolService =new DrawingToolService();
    const toolService = new ToolsService();
    const gridService = new GridService();
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const stampService = new StampService();
    const iconService = new IconService();
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);
    service.initialisation(rendererFactory, elementRef, colorService, attributesDrawingTools, attributeShapeTools,drawingService,textService, shortcutService, stampService);
   
    const testTool = Tools.PEN;
    service['properties'].toolChosen = testTool;
    const pen: PenComponent = new PenComponent(service['renderer'], service['anchorSVJ'], service['drawingService']);
    service['tools'].pen = pen;
    spyOn(service, 'chooseToolMouseUp').and.callThrough();
    spyOn(service['tools'].pen, 'removeNull').and.callThrough();
    service.chooseToolMouseUp();
    expect(service['properties'].toolChosen).toBe(testTool);
  });
});
