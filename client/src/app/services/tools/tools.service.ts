/*
  Auteur: Équipe 12
  Description: Ce service permet de créer un lien entre les différents outils, la surface de dessin
  et la barre d'outils
 */
import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { FeatherComponent } from 'src/app/components/drawing-tools/feather/feather.component';
import { PenComponent } from 'src/app/components/drawing-tools/pen/pen.component';
import { SprayPaintComponent } from 'src/app/components/drawing-tools/spray-paint/spray-paint.component';
import { PolygonComponent } from 'src/app/components/shape-tools/polygon/polygon.component';
import { TextComponent } from 'src/app/components/text/text.component';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { LineComponent } from '../../components/drawing-tools/line/line.component';
import { PaintbrushComponent } from '../../components/drawing-tools/paintbrush/paintbrush.component';
import { PencilComponent } from '../../components/drawing-tools/pencil/pencil.component';
import { EllipseComponent } from '../../components/shape-tools/ellipse/ellipse.component';
import { RectangleComponent } from '../../components/shape-tools/rectangle/rectangle.component';
import { StampComponent } from '../../components/stamp/stamp.component';
import { ActiveToolService } from '../active-tool/active-tool.service';
import { ColorService } from '../color/color.service';
import { DrawingToolService } from '../drawing-tools/drawing-tools.service';
import { ShapeService } from '../shape/shape.service';
import { ShortcutsService } from '../shortcuts/shortcuts.service';
import { StampService } from '../stamp/stamp.service';
import { TextService } from '../text/text.service';
import { Color, Final, Initial, ToolChosen, ToolProperties, Tools, ToolType } from './tool-properties';

const BORDERWIDTH = 5;

@Injectable({
  providedIn: 'root',
})

export class ToolsService implements ActiveToolService {
  private rendererFactory: RendererFactory2;
  private anchorSVJ: ElementRef;
  private colorService: ColorService;
  private attributesDrawingTools: DrawingToolService;
  private attributeShapeTools: ShapeService;
  private drawingService: DrawingService;
  private textService: TextService;
  private shortcutService: ShortcutsService;
  private stampService: StampService;
  private renderer: Renderer2;
  private event: MouseEvent;
  private primaryColor: string;
  private secondaryColor: string;
  private color: Color;
  private coordInit: Initial;
  private coordFinal: Final;
  private tools: ToolType;
  private properties: ToolProperties = new ToolProperties();

  setToolbarWidth(width: number): void {
    this.properties.toolbarWidth = width;
  }

  setAmountScrolled(amountX: number, amountY: number): void {
    this.properties.amountScrolledX = amountX;
    this.properties.amountScrolledY = amountY;
  }

  setToolName(toolName: string): void {
    this.properties.toolName = toolName;
  }

  getToolName(): string {
    return this.properties.toolName;
  }

  mouseDown(event: MouseEvent): void {
    this.toolAttributes();
    const x1 = event.clientX - this.properties.toolbarWidth + this.properties.amountScrolledX - BORDERWIDTH;
    const y1 = event.clientY + this.properties.amountScrolledY - BORDERWIDTH;
    this.coordInit = { x1, y1 };
    this.properties.firstPoint = false;
    this.properties.drag = true;
    this.chooseToolMouseDown();
  }

  mouseMove(event: MouseEvent): void {
    this.event = event;
    const x2 = event.clientX - this.properties.toolbarWidth + this.properties.amountScrolledX - BORDERWIDTH;
    const y2 = event.clientY + this.properties.amountScrolledY - BORDERWIDTH;
    this.coordFinal = { x2, y2 };
    this.chooseToolMouseMove();
  }

  mouseUp(event: MouseEvent): void {
    const x2 = event.clientX - this.properties.toolbarWidth + this.properties.amountScrolledX - BORDERWIDTH;
    const y2 = event.clientY + this.properties.amountScrolledY - BORDERWIDTH;
    this.coordFinal = { x2, y2 };
    this.properties.firstPoint = true;
    this.chooseToolMouseUp();
    this.properties.drag = false;
  }

  doubleClick(event: MouseEvent): void {
    if (this.properties.toolChosen === Tools.LINE) {
      this.properties.dblClick = true;
      this.tools.lineTool.doubleClick(event);
      this.tools.lineTool.removeNull();
    }
  }

  lineShortcuts(escKey: boolean): void {
    if (this.properties.toolChosen === Tools.LINE) {
      if (escKey) {
        this.properties.escKeyOn = true;
        this.tools.lineTool.removeLine();
      } else {
        this.properties.escKeyOn = false;
      }
    }
  }

  pointShortcuts(backSpace: boolean): void {
    if (this.properties.toolChosen === Tools.LINE && backSpace) {
      this.tools.lineTool.currentPosition(this.coordFinal.x2, this.coordFinal.y2, true);
      this.tools.lineTool.removePoint();
    } else {
      this.tools.lineTool.currentPosition(this.coordFinal.x2, this.coordFinal.y2, false);
    }
  }

  chooseToolMouseDown(): void {
    switch (this.properties.toolChosen) {
      case Tools.FEATHER:
        this.tools.featherTool.createPath(this.coordInit.x1, this.coordInit.y1, this.properties.width,
          this.color.primaryColor, this.properties.opacity);
        break;

      case Tools.TEXT:
        this.tools.textTool.write(this.coordInit.x1, this.coordInit.y1, this.shortcutService, this.color.primaryColor);
        break;

      case Tools.RECTANGLE:
        this.tools.rectangleTool.createRectangle(this.color.primaryColor, this.color.secondaryColor, this.properties.width,
          this.properties.typeChosen);
        break;

      case Tools.SPRAY_PAINT:
        this.tools.sprayPaintTool.createPoint(this.coordInit.x1, this.coordInit.y1, this.properties.width,
          this.color.primaryColor, this.properties.emission);
        break;

      case Tools.PENCIL:
        this.tools.pencilTool.createPath(this.coordInit.x1, this.coordInit.y1, this.properties.width, this.color.primaryColor);
        break;

      case Tools.PEN:
        this.tools.pen.createPath(this.coordInit.x1, this.coordInit.y1, this.color.primaryColor,
          this.properties.maxTip, this.properties.minTip, this.properties.opacity);
        break;

      case Tools.PAINTBRUSH:
        this.tools.paintbrushTool.createPaintbrush(this.coordInit.x1, this.coordInit.y1, this.color.primaryColor, this.properties.width,
          this.properties.texture);
        break;

      case Tools.ELLIPSE:
        this.tools.ellipseTool.createEllipse(this.color.primaryColor, this.color.secondaryColor, this.properties.width,
          this.properties.typeChosen);
        break;

      case Tools.LINE:
        this.tools.lineTool.createPath(this.coordInit.x1, this.coordInit.y1, this.properties.width, this.color.primaryColor,
          this.properties.pattern, this.properties.diameter, this.properties.junctionType);
        break;

      case Tools.STAMP:
        this.tools.stampTool.createPath(this.coordInit.x1, this.coordInit.y1, this.properties.scale,
          this.properties.stamp);
        break;

      case Tools.POLYGON:
        this.tools.polygonTool.createPolygon(this.color.primaryColor, this.color.secondaryColor, this.properties.width,
          this.properties.typeChosen);
        break;
    }
  }

  chooseToolMouseMove(): void {
    if (this.properties.drag) {
      switch (this.properties.toolChosen) {
        case Tools.FEATHER:
          this.tools.featherTool.drawFeather(this.coordFinal.x2, this.coordFinal.y2);
          break;

        case Tools.SPRAY_PAINT:
          this.tools.sprayPaintTool.drawSprayPaint(this.coordFinal.x2, this.coordFinal.y2);
          break;

        case Tools.RECTANGLE:
          this.tools.rectangleTool.drawRectangle(this.coordInit.x1, this.coordFinal.x2, this.coordInit.y1, this.coordFinal.y2, this.event);
          break;

        case Tools.PENCIL:
          this.tools.pencilTool.drawPencil(this.coordFinal.x2, this.coordFinal.y2);
          break;

        case Tools.PEN:
          this.tools.pen.drawPen(this.coordFinal.x2, this.coordFinal.y2);
          break;

        case Tools.PAINTBRUSH:
          this.tools.paintbrushTool.drawPaintbrush(this.coordFinal.x2, this.coordFinal.y2);
          break;

        case Tools.ELLIPSE:
          this.tools.ellipseTool.drawEllipse(this.coordInit.x1, this.coordFinal.x2, this.coordInit.y1, this.coordFinal.y2, this.event);
          break;

        case Tools.POLYGON:
          this.tools.polygonTool.drawPolygon(this.coordInit.x1, this.coordFinal.x2, this.coordInit.y1, this.coordFinal.y2,
            this.properties.nbOfPoints);
          break;
      }
    }
    if (this.properties.toolChosen === Tools.LINE) {
      this.tools.lineTool.currentPosition(this.coordFinal.x2, this.coordFinal.y2, this.properties.escKeyOn);
    }
  }

  chooseToolMouseUp(): void {
    switch (this.properties.toolChosen) {
      case Tools.FEATHER:
        this.tools.featherTool.removeNull();
        break;

      case Tools.SPRAY_PAINT:
          this.tools.sprayPaintTool.removeNull();
          break;

      case Tools.RECTANGLE:
        this.tools.rectangleTool.removeNull();
        break;

      case Tools.PEN:
        this.tools.pen.removeNull();
        break;

      case Tools.ELLIPSE:
        this.tools.ellipseTool.removePreview();
        break;

      case Tools.POLYGON:
        this.tools.polygonTool.removePreview();
        break;

      case Tools.PENCIL:
        this.tools.pencilTool.removeNull();
        break;

      case Tools.PAINTBRUSH:
        this.tools.paintbrushTool.removeNull();
        break;
    }
  }
  toolAttributes(): void {
    this.colorService.currentPrimaryColor.subscribe((primary: string) => this.primaryColor = primary);
    this.colorService.currentSecondaryColor.subscribe((secondary: string) => this.secondaryColor = secondary);
    this.colorService.currentTransparency.subscribe((opacity: number) => this.properties.opacity = opacity);
    this.color = { primaryColor: this.primaryColor, secondaryColor: this.secondaryColor };

    if (this.properties.toolName === ToolChosen.SHAPES) {
      this.shapeToolAttributes();
    } else if (this.properties.toolName === ToolChosen.DRAWING_TOOLS) {
      this.drawingToolAttributes();
    } else if (this.properties.toolName === ToolChosen.STAMP) {
      this.stampAttributes();
    } else if (this.properties.toolName === ToolChosen.TEXT) {
      this.properties.toolChosen = Tools.TEXT;
    }
  }

  drawingToolAttributes() {
    this.properties.texture = this.attributesDrawingTools.texture;
    this.properties.width = this.attributesDrawingTools.strokeWidth;
    this.properties.toolChosen = this.attributesDrawingTools.selectedTool;

    this.properties.pattern = this.attributesDrawingTools.pattern;
    this.properties.diameter = this.attributesDrawingTools.diameter;
    this.properties.junctionType = this.attributesDrawingTools.junction;
    this.properties.displayPoint = this.attributesDrawingTools.displayPoint;
    this.properties.maxTip = this.attributesDrawingTools.maxTip;
    this.properties.minTip = this.attributesDrawingTools.minTip;
    this.properties.emission = this.attributesDrawingTools.emission;
    this.tools.lineTool.displayLineWithPoint(this.properties.displayPoint);
  }

  stampAttributes() {
    this.properties.toolChosen = this.stampService.tool;
    this.properties.stamp = this.stampService.stamp;
    this.properties.scale = this.stampService.scale;
  }

  shapeToolAttributes() {
    this.properties.width = this.attributeShapeTools.strokeWidth;
    this.properties.toolChosen = this.attributeShapeTools.shape;
    this.properties.typeChosen = this.attributeShapeTools.type;
    this.properties.nbOfPoints = this.attributeShapeTools.nbPoints;
  }

  initialisation(rendererFactory: RendererFactory2, anchorSVJ: ElementRef, colorService: ColorService,
                 attributesDrawingTools: DrawingToolService, attributeShapeTools: ShapeService, drawingService: DrawingService,
                 textService: TextService, shortcutService: ShortcutsService, stampService: StampService): void {
    this.rendererFactory = rendererFactory;
    this.anchorSVJ = anchorSVJ;
    this.colorService = colorService;
    this.drawingService = drawingService;
    this.attributesDrawingTools = attributesDrawingTools;
    this.attributeShapeTools = attributeShapeTools;
    this.textService = textService;
    this.shortcutService = shortcutService;
    this.stampService = stampService;

    this.renderer = this.rendererFactory.createRenderer(null, null);
    const sprayPaintTool = new SprayPaintComponent(this.renderer, this.anchorSVJ, this.drawingService);
    const rectangleTool = new RectangleComponent(this.renderer, this.anchorSVJ, this.drawingService);
    const pencilTool = new PencilComponent(this.renderer, this.anchorSVJ, this.drawingService);
    const pen = new PenComponent(this.renderer, this.anchorSVJ, this.drawingService);
    const paintbrushTool = new PaintbrushComponent(this.renderer, this.anchorSVJ, this.drawingService);
    const ellipseTool = new EllipseComponent(this.renderer, this.anchorSVJ, this.drawingService);
    const lineTool = new LineComponent(this.renderer, this.anchorSVJ, this.drawingService);
    const stampTool = new StampComponent(this.renderer, this.anchorSVJ, this.drawingService, this.stampService);
    const polygonTool = new PolygonComponent(this.renderer, this.anchorSVJ, this.drawingService);
    const textTool = new TextComponent(this.renderer, this.anchorSVJ, this.drawingService, this.textService, this.colorService);
    const featherTool = new FeatherComponent(this.renderer, this.anchorSVJ, this.drawingService, this.attributesDrawingTools);
    this.tools = {
      rectangleTool, pencilTool, paintbrushTool, ellipseTool,
      lineTool, stampTool, polygonTool, pen, textTool, sprayPaintTool, featherTool,
    };
  }

  setToolChosen(toolChosen: string): void {
    this.properties.toolChosen = toolChosen;
  }

  getToolChosen(): string {
    return this.properties.toolChosen;
  }

  displayPointForLine(): void {
    this.tools.lineTool.displayLineWithPoint(this.properties.displayPoint);
  }

  onKeyDown(keyboard: KeyboardEvent) {
    this.tools.textTool.onWritingText(keyboard);
  }
}
