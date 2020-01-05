import { FeatherComponent } from 'src/app/components/drawing-tools/feather/feather.component';
import { PenComponent } from 'src/app/components/drawing-tools/pen/pen.component';
import { SprayPaintComponent } from 'src/app/components/drawing-tools/spray-paint/spray-paint.component';
import { PolygonComponent } from 'src/app/components/shape-tools/polygon/polygon.component';
import { TextComponent } from 'src/app/components/text/text.component';
import { LineComponent } from '../../components/drawing-tools/line/line.component';
import { PaintbrushComponent } from '../../components/drawing-tools/paintbrush/paintbrush.component';
import { PencilComponent } from '../../components/drawing-tools/pencil/pencil.component';
import { EllipseComponent } from '../../components/shape-tools/ellipse/ellipse.component';
import { RectangleComponent } from '../../components/shape-tools/rectangle/rectangle.component';
import { StampComponent } from '../../components/stamp/stamp.component';

export class ToolProperties {
    nbOfPoints: number;
    font: string;
    mutater: string;
    alignment: string;
    textSize: number;
    width: number;
    diameter: number;
    toolName: string;
    toolChosen: string;
    typeChosen: string;
    texture: string;
    pattern: string;
    scale: number;
    stamp: string;
    opacity: number;
    drag: boolean;
    firstPoint: boolean;
    dblClick: boolean;
    removePoint: boolean;
    escKeyOn: boolean;
    displayPoint: boolean;
    junctionType: string;
    toolbarWidth: number;
    amountScrolledX = 0;
    amountScrolledY = 0;
    bold: string;
    italic: string;
    maxTip: number;
    minTip: number;
    emission: number;
}

export interface ToolType {
    sprayPaintTool: SprayPaintComponent;
    rectangleTool: RectangleComponent;
    pencilTool: PencilComponent;
    paintbrushTool: PaintbrushComponent;
    ellipseTool: EllipseComponent;
    lineTool: LineComponent;
    stampTool: StampComponent;
    polygonTool: PolygonComponent;
    pen: PenComponent;
    textTool: TextComponent;
    featherTool: FeatherComponent;
}
export interface Color {
    secondaryColor: string;
    primaryColor: string;
}

export interface Initial {
    x1: number;
    y1: number;
}
export interface Final {
    x2: number;
    y2: number;
}

export enum Tools {
    RECTANGLE = 'Rectangle',
    POLYGON = 'Polygon',
    ELLIPSE = 'Ellipse',
    PENCIL = 'Pencil',
    PAINTBRUSH = 'Paintbrush',
    LINE = 'Line',
    STAMP = 'Stamp',
    PEN = 'Pen',
    TEXT = 'Text',
    SPRAY_PAINT = 'SprayPaint',
    FEATHER = 'Feather',
}

export enum ToolChosen {
    DRAWING_TOOLS = 'drawingTools',
    SHAPES = 'shapes',
    STAMP = 'stamp',
    FILL = 'fill',
    SELECT = 'select',
    ERASER= 'eraser',
    TEXT = 'text',
    PAINTBUCKET= 'paintBucket',
}
