/* tslint:disable */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingToolService } from 'src/app/services/drawing-tools/drawing-tools.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { IconService } from 'src/app/services/Icon/icon.service';
import { SelectionService } from 'src/app/services/selection/selection.service';
import { ShapeService } from 'src/app/services/shape/shape.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { StampService } from 'src/app/services/stamp/stamp.service';
import { TextService } from 'src/app/services/text/text.service';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { AttributesSelectComponent } from './attributes-select.component';
import { ManipulationService } from 'src/app/services/manipulation/manipulation.service';

class MockSVGComponent { }
class MockSVGElement { }
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
  createElement(element: any, element2: any) {
    return true;
  }
}

describe('AttributesSelectComponent', () => {
  let component: AttributesSelectComponent;
  let fixture: ComponentFixture<AttributesSelectComponent>;
  let textService: TextService;
  let shortcutService: ShortcutsService;
  let stampService: StampService;
  let drawingToolService: DrawingToolService;
  let colorService: ColorService;
  let toolService: ToolsService;
  let gridService: GridService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttributesSelectComponent],
      imports: [TestingImportsModule],
      providers: [SelectionService, { provide: ElementRef, useClass: MockSVGComponent },
        { provide: SVGElement, useClass: MockSVGElement }, { provide: Renderer2, useClass: MockRenderer },
        { provide: RendererFactory2, useClass: MockRendererFactory }, AttributesSelectComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.get(AttributesSelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    component = new AttributesSelectComponent(selectionService,shortcutService);
    expect(component).toBeTruthy();
  });

  it('should selectAll', () => {
    component = TestBed.get(AttributesSelectComponent);
    const selectionService= TestBed.get(SelectionService);
    selectionService.renderer = TestBed.get(Renderer2);
    selectionService.svgElement = TestBed.get(ElementRef);
    const spy = spyOn(selectionService, 'selectAllElements');
    component['selectAll']();
    expect(spy).toHaveBeenCalled();
  });

  it('should copy', () => {
    const shapeService = new ShapeService();
    const selectionService = TestBed.get(SelectionService);
    const stampService = new StampService();
    const iconService = new IconService();
    const drawingService = new DrawingService();
    const manipulationService = new ManipulationService(gridService);
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);   
    component = new AttributesSelectComponent(selectionService,shortcutService);
    selectionService.renderer = TestBed.get(Renderer2);
    selectionService.svgElement = TestBed.get(ElementRef);
    selectionService.drawingSurface = TestBed.get(SVGElement);
    component['stateBox'] = true;
    const spy = spyOn(component['selectionService'], 'copy');
    component['copy']();
    expect(spy).toHaveBeenCalled();
    expect(component['copied']).toEqual(true);
  });

  it('should paste', () => {
    const shapeService = new ShapeService();
    const selectionService = TestBed.get(SelectionService);
    const stampService = new StampService();
    const iconService = new IconService();
    const drawingService = new DrawingService();
    const manipulationService = new ManipulationService(gridService);
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);    
      component = new AttributesSelectComponent(selectionService,shortcutService);
    selectionService.renderer = TestBed.get(Renderer2);
    const spy = spyOn<any>(component, 'paste');
    spyOn(selectionService,'paste').and.callThrough();
    component['paste']();
    expect(spy).toHaveBeenCalled();
  });

  it('should cut', () => {
    const shapeService = new ShapeService();
    const selectionService = TestBed.get(SelectionService);
    const stampService = new StampService();
    const iconService = new IconService();
    const drawingService = new DrawingService();
    const manipulationService = new ManipulationService(gridService);
    const shortcutService= new ShortcutsService(shapeService,drawingToolService,toolService,gridService,colorService,
      selectionService, stampService, iconService,drawingService, manipulationService);       
    component = new AttributesSelectComponent(selectionService,shortcutService);
    selectionService.renderer = TestBed.get(Renderer2);
    selectionService.clipboardService = TestBed.get(ClipboardService);
    spyOn(selectionService, 'cut');
    const spy = spyOn<any>(component, 'cut');
    component['cut']();
    expect(spy).toHaveBeenCalled();

  });

  it('should duplicate', () => {
    component = TestBed.get(AttributesSelectComponent);
    const selectionService= TestBed.get(SelectionService);
    selectionService.renderer = TestBed.get(Renderer2);
    selectionService.svgElement = TestBed.get(ElementRef);
    const spy = spyOn(selectionService, 'duplicate');
    component['duplicate']();
    expect(spy).toHaveBeenCalled();
  });

  it('should delete', () => {
    const component = TestBed.get(AttributesSelectComponent);
    component['selectionService']['drawingService'] = new DrawingService();
    const spy = spyOn(component['selectionService'], 'delete');
    component['delete']();
    expect(spy).toHaveBeenCalled();
  });

  it('should stateBoxCreated if boxCreated=true', () => {
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    component = new AttributesSelectComponent(selectionService,shortcutService);
    const test = true;
    component['stateBoxCreated'](test);
    expect(component['stateBox']).toBe(true);
  });

  it('should stateBoxCreated if boxCreated=false', () => {
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    component = new AttributesSelectComponent(selectionService,shortcutService);
    const test = false;
    component['stateBoxCreated'](test);
    expect(component['stateBox']).toBe(false);
  });

  it('should stateClipboard if clipboardFull=true', () => {
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    component = new AttributesSelectComponent(selectionService,shortcutService);
    const test = true;
    component['stateClipboard'](test);
    expect(component['clipboardFull']).toBe(true);
  });

  

  it('should stateClipboard if clipboardFull=false', () => {
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    component = new AttributesSelectComponent(selectionService,shortcutService);
    const test = false;
    component['stateClipboard'](test);
    expect(component['clipboardFull']).toBe(false);
  });

  it('should stateRotationButton ', () => {
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    component = new AttributesSelectComponent(selectionService,shortcutService);
    component['stateRotationButton']();
    expect(component['rotationChoosen']).toBe(true);
  });

  it('should setRotation ', () => {
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const shortcutService= TestBed.get(ShortcutsService);
    component = new AttributesSelectComponent(selectionService,shortcutService);
    const rotation :string ='180';
    const spy= spyOn(shortcutService,'setChoosenRotation');
    spyOn<any>(component,'stateRotationButton').and.callThrough();
    component.setRotation(rotation);
    expect(component['rotationChoosen']).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  it('should setMagnetism ', () => {
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    component = new AttributesSelectComponent(selectionService,shortcutService);
    component.setMagnetism();
    expect(selectionService.magneticPoint).toEqual(component['magneticPoint']);
  });

  it('should toggleMagnetism ', () => {
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    component = new AttributesSelectComponent(selectionService,shortcutService);
    component['isMagnetised']=true;
    component['toggleMagnetism']();
    expect(component['isMagnetised']).toEqual(false);
    expect(selectionService['isMagnetised']).toEqual(false);
  });

  it('should rotate if angle< rotate', () => {
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const shortcutService= TestBed.get(ShortcutsService);
    component = new AttributesSelectComponent(selectionService,shortcutService);
    const rotate:number=190;
    component['angle']=10;
    const spy= spyOn(shortcutService,'changeRotation');
    component['rotate'](rotate);
    expect(component['angle']).toEqual(rotate);
    expect(spy).toHaveBeenCalled();
  });

  it('should rotate if angle> rotate', () => {
    const manipulationService = new ManipulationService(gridService);
    const selectionService = new SelectionService(manipulationService);
    const shortcutService= TestBed.get(ShortcutsService);
    component = new AttributesSelectComponent(selectionService,shortcutService);
    const rotate:number=190;
    component['angle']=310;
    const spy= spyOn(shortcutService,'changeRotation');
    component['rotate'](rotate);
    expect(component['angle']).toEqual(rotate);
    expect(spy).toHaveBeenCalled();
  });
});
