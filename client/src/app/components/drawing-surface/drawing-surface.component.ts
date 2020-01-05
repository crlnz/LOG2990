/* tslint:disable directive-class-suffix */

/*  Auteur: Équipe 12
    Description: Cette composante gère les choix de couleurs choisis par l'utilisateur sur la palette de couleur
*/
import { Component, Directive, ElementRef, HostListener, OnInit, Renderer2, RendererFactory2, ViewChild } from '@angular/core';
import { ActiveToolService } from 'src/app/services/active-tool/active-tool.service';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { ColorApplicatorService } from 'src/app/services/color-applicator/color-applicator.service';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { EraserService } from 'src/app/services/eraser/eraser.service';
import { ExportService } from 'src/app/services/export/export.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { IconService } from 'src/app/services/Icon/icon.service';
import { OpenDrawingService } from 'src/app/services/open-drawing/open-drawing.service';
import { PaintBucketService } from 'src/app/services/paintBucket/paint-bucket.service';
import { PipetteService } from 'src/app/services/pipette/pipette.service';
import { SelectionService } from 'src/app/services/selection/selection.service';
import { ShapeService } from 'src/app/services/shape/shape.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { StampService } from 'src/app/services/stamp/stamp.service';
import { TextService } from 'src/app/services/text/text.service';
import { ToolChosen, Tools } from 'src/app/services/tools/tool-properties';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { Drawing } from '../../../../../common/communication/drawing';
import { DrawingToolService } from '../../services/drawing-tools/drawing-tools.service';
import { FormService } from '../../services/form/form.service';
import { DrawingProperties } from '../create-drawing/drawing-properties';
import { SvgAttributes, SvgTypes } from '../svg-attributes';
import { DrawingSurfaceAttributes } from './drawing-surface-attributes';

const BALISE_DEF = '[object SVGDefsElement]';
const MOUSE_CLICK = 'click';
const DEFAULT_COLOR = '#FFFFFF';
const EMPTY_STRING = '';
const DEFAULT_DRAWING_INDEX = -1;
const DEFAULT_DRAWING_LENGTH = 0;

@Component({
  selector: 'app-drawing-surface',
  templateUrl: './drawing-surface.component.html',
  styleUrls: ['./drawing-surface.component.css'],
})

@Directive({ selector: '[onlyDrawingSurfaceComponent]' })
export class DrawingSurfaceComponent implements OnInit {
  @ViewChild('anchorSVJ', { static: false }) anchorSVJ: ElementRef;
  private renderer: Renderer2;
  private activeTool: ActiveToolService;
  private svgElements: Drawing;
  private drawingProperties: DrawingProperties = { color: DEFAULT_COLOR, width: EMPTY_STRING, height: EMPTY_STRING };
  private properties: DrawingSurfaceAttributes = new DrawingSurfaceAttributes();

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent): void {
    if (this.toolService.getToolName() === ToolChosen.TEXT) {
      this.toolService.onKeyDown(event);
    }
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(event: KeyboardEvent): void {
    this.shortcutsService.onKeyUp(event);
  }

  @HostListener('DOMMouseScroll', ['$event'])
  mouseWheelFirefox(event: WheelEvent): void {
    if (this.toolService.getToolName() === ToolChosen.STAMP || this.toolService.getToolName() === ToolChosen.SELECT) {
      event.preventDefault();
      this.shortcutsService.changeRotation(event.detail);
    }
  }

  @HostListener('mousewheel', ['$event'])
  scroll(event: WheelEvent): void {
    if (this.toolService.getToolName() === ToolChosen.STAMP || this.toolService.getToolName() === ToolChosen.SELECT
    || (this.toolService.getToolName() === ToolChosen.DRAWING_TOOLS )) {
      event.preventDefault();
      this.shortcutsService.changeRotation(event.deltaY);
    }
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    this.colorApplicator.onRightClick(event, this.properties.fillTool);
  }

  mouseClick(event: { target: SVGElement }): void {
    this.colorApplicator.mouseClick(event, this.properties.fillTool);
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.properties.onSurface) {
      this.mouseUp(event);
    }
    this.properties.onSurface = false;
  }

  constructor(private rendererFactory: RendererFactory2, private formService: FormService, private toolService: ToolsService,
              private iconService: IconService, private colorService: ColorService, private drawingToolService: DrawingToolService,
              private attributeShapeTools: ShapeService, private gridService: GridService, private shortcutsService: ShortcutsService,
              private colorApplicator: ColorApplicatorService, private pipetteService: PipetteService,
              private drawingService: DrawingService, private selectionService: SelectionService,
              private openDrawingService: OpenDrawingService, private clipboardService: ClipboardService,
              private eraserService: EraserService, private textService: TextService, private stampService: StampService,
              private exportService: ExportService, private paintBucketService: PaintBucketService) {

    this.formService.listen().subscribe(() => {
      this.drawingService.allDrawings.length = DEFAULT_DRAWING_LENGTH;
      this.drawingService.drawingsIndex = DEFAULT_DRAWING_INDEX;
      this.getProperties();
      this.clearSVG();
    });
    this.iconService.listenToolClick().subscribe(() => this.selectTool(this.iconService.sendIcon()));
    this.openDrawingService.listenOpenDrawing().subscribe(() => this.openDrawing());
    this.gridService.listenGridClick().subscribe(() => this.toggleGrid());
    this.shortcutsService.getShortcutGrid().subscribe((value) => this.displayGrid(value));
    this.shortcutsService.getShortcutSelect().subscribe((value) => this.selectToolShortcut(value));
    this.shortcutsService.getFillToolShortcut().subscribe((value) => this.fillToolShortcut(value));
    this.shortcutsService.getShortcutTool().subscribe((value) => this.stateTool(value));
    this.shortcutsService.getShortcutErase().subscribe((value) => this.eraseToolShortcut(value));
    this.gridService.currentSquareSize.subscribe((squareSize) => (this.properties.gridSquareSize) = squareSize);
    this.gridService.currentGridTransparency.subscribe((gridTransparency) => this.properties.gridTransparency = gridTransparency);
    this.exportService.listenExportClick().subscribe(() => this.exportSvg());
    this.drawingService.listenUndoClick().subscribe(() => {
      (this.drawingService.drawingsIndex === DEFAULT_DRAWING_INDEX) ? this.clearSVG() :
        this.updateCurrentDrawing(this.drawingService.allDrawings[this.drawingService.drawingsIndex]);
    });

    this.drawingService.listenRedoClick().subscribe(() => {
      this.updateCurrentDrawing(this.drawingService.allDrawings[this.drawingService.drawingsIndex]);
    });
  }

  ngOnInit() {
    this.colorService.currentBackgroundColor.subscribe((color: string) => {
      this.properties.color = color;
      this.drawingProperties.color = color;
      this.formService.drawingProperties = this.drawingProperties;
    });
  }

  private updateCurrentDrawing(array: string[]): void {
    this.clearSVG();
    for (const element of array) {
      const object = this.renderer.createElement(SvgTypes.X);
      this.renderer.appendChild(this.anchorSVJ.nativeElement, object);
      object.outerHTML = element;
    }
  }

  private getProperties(): void {
    this.drawingProperties = this.formService.drawingProperties;
    this.properties.color = this.drawingProperties.color;
    this.properties.width = this.drawingProperties.width;
    this.properties.height = this.drawingProperties.height;
    this.initialiseServices();
  }

  private initialiseServices(): void {
    this.selectionService.initialisation(this.rendererFactory, this.anchorSVJ, this.clipboardService, this.drawingService);
    this.toolService.initialisation(this.rendererFactory, this.anchorSVJ, this.colorService, this.drawingToolService,
      this.attributeShapeTools, this.drawingService, this.textService, this.shortcutsService, this.stampService);
    this.clipboardService.initialisation(this.rendererFactory, this.anchorSVJ, this.drawingService);
    this.eraserService.initialisation(this.rendererFactory, this.anchorSVJ, this.drawingService);
    this.properties.pipetteTool = this.colorService.pipetteTool;
    this.properties.drawingCreated = true;
    this.paintBucketService.initialisation(this.rendererFactory, this.anchorSVJ);
  }

  private clearSVG(): void {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    const children = this.anchorSVJ.nativeElement.children;
    for (const child of children) {
      if (child.toString() !== BALISE_DEF) {
        this.renderer.removeChild(this.anchorSVJ.nativeElement, child);
      }
    }
  }

  private openDrawing(): void {
    this.svgElements = this.openDrawingService.currentDrawingData;
    this.clearSVG();
    this.initialiseServices();
    this.properties.color = this.svgElements.drawingColor;
    this.properties.width = this.svgElements.drawingWidth;
    this.properties.height = this.svgElements.drawingHeight;

    for (const svgelement of this.svgElements.svgList) {
      const element = this.renderer.createElement(SvgTypes.X);
      this.renderer.appendChild(this.anchorSVJ.nativeElement, element);
      element.outerHTML = svgelement;
    }
    this.drawingProperties = { color: this.properties.color, width: this.properties.width, height: this.properties.height };
    this.formService.drawingProperties = this.drawingProperties;
    this.drawingService.drawingArray = this.svgElements.svgList;
  }

  private selectTool(toolChosen: string): void {
    this.properties.fillTool = false;
    this.properties.toolImplemented = false;
    this.textService.changeToolChosen(toolChosen !== ToolChosen.TEXT);
    this.drawingToolService.updateAngle(0);
    this.stampService.updateRotation(0);

    if (toolChosen === ToolChosen.DRAWING_TOOLS || toolChosen === ToolChosen.SHAPES || toolChosen === ToolChosen.STAMP
      || toolChosen === ToolChosen.TEXT) {
      this.properties.toolImplemented = true;
      this.activeTool = this.toolService;
    } else if (toolChosen === ToolChosen.FILL) {
      this.properties.fillTool = true;
    } else if (toolChosen === ToolChosen.SELECT) {
      this.properties.toolImplemented = true;
      this.activeTool = this.selectionService;
    } else if (toolChosen === ToolChosen.ERASER) {
      this.properties.toolImplemented = true;
      this.activeTool = this.eraserService;
    } else if (toolChosen === ToolChosen.PAINTBUCKET) {
      this.properties.toolImplemented = true;
      this.activeTool = this.paintBucketService;
    }

    this.toolService.setToolName(toolChosen);
    if (this.toolService.getToolChosen() !== ToolChosen.ERASER) {
      this.eraserService.removeEraser();
    }
  }

  private mouseDown(event: MouseEvent): void {
    this.properties.onSurface = true;
    this.properties.pipetteTool = this.colorService.pipetteTool;
    if (this.properties.pipetteTool) {
      this.pipetteService.getSvgColor(event);
    } else if (this.activeTool !== this.selectionService && this.selectionService.controlsBoxCreated) {
      this.selectionService.removeControls();
    } else if (this.properties.toolImplemented) {
      this.activeTool.mouseDown(event);
    }
  }

  private mouseMove(event: MouseEvent): void {
    if (this.properties.toolImplemented) {
      this.activeTool.mouseMove(event);
    }
  }

  private mouseUp(event: MouseEvent): void {
    if (this.properties.toolImplemented) {
      this.activeTool.mouseUp(event);
    }
  }

  private doubleClick(event: MouseEvent): void {
    if (this.properties.toolImplemented) {
      this.activeTool.doubleClick(event);
    }
  }

  private selectToolShortcut(stateSelectTool: boolean): void {
    if (stateSelectTool) {
      this.eraserService.removeEraser();
      this.properties.fillTool = false;
      this.properties.toolImplemented = true;
      this.activeTool = this.selectionService;
    }
  }

  private stateTool(stateTool: boolean): void {
    if (stateTool) {
      this.eraserService.removeEraser();
      this.properties.fillTool = false;
      this.properties.toolImplemented = true;
      this.activeTool = this.toolService;
    }
  }

  private eraseToolShortcut(stateEraseTool: boolean): void {
    if (stateEraseTool) {
      this.properties.fillTool = false;
      this.properties.toolImplemented = true;
      this.activeTool = this.eraserService;
    }
  }

  private displayGrid(stateGrid: boolean): void {
    if (stateGrid) {
      this.toggleGrid();
    }
  }

  private fillToolShortcut(stateShortcut: boolean): void {
    if (stateShortcut) {
      this.eraserService.removeEraser();
      this.properties.toolImplemented = false;
      this.properties.fillTool = true;
    }
  }

  private toggleGrid(): void {
    this.properties.showGrid = !this.properties.showGrid;
  }

  private triggerDownload(imgURL: string, fileName: string): void {
    const click = new MouseEvent(MOUSE_CLICK);
    const image = this.renderer.createElement(SvgTypes.A);
    image.setAttribute(SvgAttributes.DOWNLOAD, fileName);
    image.setAttribute(SvgAttributes.HREF, imgURL);
    image.dispatchEvent(click);
  }

  private exportSvg(): void {
    this.exportService.exportSvg(this.anchorSVJ, this.rendererFactory, this.properties.height, this.properties.width);
  }
}
