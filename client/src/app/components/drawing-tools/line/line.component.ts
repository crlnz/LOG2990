/*  Auteur: Équipe 12
    Description: Cette composante gère l'outil ligne.
*/
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { SvgAttributes, SvgTypes } from '../../svg-attributes';
import { DrawingToolProperties } from '../drawing-tool-properties';
import { LineAttributes } from './line-properties';

const COMMA = ',';
const ROUND = 'round';
const NONE = 'none';
const EMPTY_STRING = '';
const ZERO_COMMA = '0,';
const RADIUS_FACTOR = 2;

enum TraceType {
  DOTTEDLINE = 'DottedLine',
  DOTTEDPOINT = 'DottedPoint',
}
@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent {
  private properties: DrawingToolProperties;
  private line: SVGElement;
  private point: SVGElement;
  private lineAttribs: LineAttributes = new LineAttributes();
  private container: SVGElement;

  constructor(private renderer: Renderer2, private svgElement: ElementRef, private drawingService: DrawingService) {}

  displayLineWithPoint(displayPoint: boolean): void {
    this.lineAttribs.displayPoint = displayPoint;
  }

  createPath(x: number, y: number, width: number, primaryColor: string, pattern: string, diameter: number,
             junctionType: string): void {
    const pathString = EMPTY_STRING;
    this.properties = {pathString, primaryColor, width};
    this.lineAttribs.junction = junctionType;
    this.lineAttribs.pattern = pattern;
    this.lineAttribs.diameter = diameter;
    this.lineAttribs.xPointFirst = x;
    this.lineAttribs.yPointFirst = y;

    if (!this.lineAttribs.hasStarted) {
      this.initialisation(x, y);
      this.lineAttribs.pointArray = [];
    }

    this.point = this.renderer.createElement(SvgTypes.CIRCLE, SvgTypes.SVG_LINK);
    this.lineAttribs.currentLine += SvgAttributes.M + x + COMMA + y;
    this.properties.pathString = this.lineAttribs.currentLine;
    this.renderer.setAttribute(this.line, SvgAttributes.D, this.properties.pathString);
    this.lineAttributes();
    this.lineAttribs.isDragged = true;

    if (this.lineAttribs.displayPoint) {
      this.renderer.setAttribute(this.point, SvgAttributes.CX, x.toString());
      this.renderer.setAttribute(this.point, SvgAttributes.CY, y.toString());
      this.attributesPoint();
      this.renderer.appendChild(this.container, this.point );
      this.lineAttribs.pointArray.push(this.point);
    }
  }

  private initialisation(x: number, y: number): void {
    this.lineAttribs.xFirst = x;
    this.lineAttribs.yFirst = y;

    this.container = this.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);
    this.line = this.renderer.createElement(SvgTypes.PATH, SvgTypes.SVG_LINK);

    this.properties.pathString = SvgAttributes.M + this.lineAttribs.xFirst + COMMA + this.lineAttribs.yFirst;

    this.renderer.setAttribute(this.line, SvgAttributes.D, this.properties.pathString);
    this.lineAttribs.currentLine = this.properties.pathString;
    this.lineAttributes();
    this.renderer.appendChild(this.svgElement.nativeElement, this.container);
    this.renderer.appendChild(this.container, this.line);

    this.lineAttribs.hasStarted = true;
  }

  doubleClick(event: MouseEvent): void {
    if (event.shiftKey) {
      this.properties.pathString += SvgAttributes.L + this.lineAttribs.xFirst + COMMA + this.lineAttribs.yFirst;
      this.renderer.setAttribute(this.line, SvgAttributes.D, this.properties.pathString);
    }
    this.lineAttribs.isDragged = false;
    this.lineAttribs.hasStarted = false;
  }

  currentPosition(x: number, y: number, escKey: boolean): void {
    if (this.lineAttribs.isDragged) {
      this.lineAttribs.currentLine = this.properties.pathString;
      if (!escKey) {
        this.lineAttribs.currentLine += SvgAttributes.L + x + COMMA + y;
      }
      this.renderer.setAttribute(this.line, SvgAttributes.D, this.lineAttribs.currentLine);
    }
  }

  private lineAttributes(): void {
    this.renderer.setAttribute(this.line, SvgAttributes.FILL, NONE);
    this.renderer.setAttribute(this.line, SvgAttributes.STROKE_WIDTH, this.properties.width.toString());
    this.renderer.setAttribute(this.line, SvgAttributes.STROKE_LINECAP, this.lineAttribs.junction);
    this.renderer.setAttribute(this.line, SvgAttributes.STROKE, this.properties.primaryColor);
    this.lineAttribs.factor = this.properties.width * RADIUS_FACTOR;

    if (this.lineAttribs.pattern === TraceType.DOTTEDLINE ) {
      this.renderer.setAttribute(this.line, SvgAttributes.STROKE_DASHARRAY, this.lineAttribs.factor.toString()
      + COMMA + this.lineAttribs.factor.toString());
      this.renderer.setAttribute(this.line, SvgAttributes.STROKE_LINEJOIN, ROUND);
    } else if (this.lineAttribs.pattern === TraceType.DOTTEDPOINT ) {
      this.renderer.setAttribute(this.line, SvgAttributes.STROKE_LINECAP, ROUND);
      this.renderer.setAttribute(this.line, SvgAttributes.STROKE_DASHARRAY, ZERO_COMMA + this.lineAttribs.factor.toString());
    }
  }

  private attributesPoint(): void {
    const rayon: number = this.lineAttribs.diameter / RADIUS_FACTOR;
    this.renderer.setAttribute(this.point, SvgAttributes.FILL, this.properties.primaryColor);
    this.renderer.setAttribute(this.point, SvgAttributes.R, rayon.toString());
  }

  removePoint(): void {
    if ((this.lineAttribs.xPointFirst !== this.lineAttribs.xFirst) && (this.lineAttribs.yPointFirst !== this.lineAttribs.yFirst)) {
      this.renderer.removeChild(this.svgElement.nativeElement, this.point);
      this.lineAttribs.isDragged = false;
      this.lineAttribs.hasStarted = false;
    }
  }

  removeLine(): void {
    this.renderer.removeChild(this.svgElement.nativeElement, this.line);
    for (const element of this.lineAttribs.pointArray) {
      this.renderer.removeChild(this.svgElement.nativeElement, element);
    }
    this.lineAttribs.isDragged = false;
    this.lineAttribs.hasStarted = false;
  }

  removeNull(): void {
    if (this.line && this.point) {
      this.drawingService.fillDrawingArray(this.container);
    }
  }
}
