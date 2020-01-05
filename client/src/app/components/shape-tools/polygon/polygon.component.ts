/*  Auteur: Équipe 12
    Description: Cette composante gère l'outils polygone.
*/
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { SvgAttributes, SvgTypes } from '../../svg-attributes';
import { ShapeProperties, TraceType } from '../shape-properties';

const BLACK = 'black';
const NONE = 'none';
const PREVIEW_STROKE_WIDTH = '1';
const PREVIEW_STROKE_DASHARRAY = '2';

@Component({
  selector: 'app-polygon',
  templateUrl: './polygon.component.html',
  styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent {
  private preview: SVGElement;
  private polygon: SVGElement;
  private nbOfPoints: number;
  private properties: ShapeProperties;
  private points: number[] = [];
  private radius: number;
  private container: SVGElement;

  constructor(private renderer: Renderer2, private svgElement: ElementRef, private drawingService: DrawingService) {}

  createPolygon(primaryColor: string, secondaryColor: string, strokeWidth: number, type: string): void {
    this.properties = { strokeWidth, secondaryColor, primaryColor, type };
    this.container = this.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);

    this.polygon = this.renderer.createElement(SvgTypes.POLYGON, SvgTypes.SVG_LINK);
    this.renderer.appendChild(this.svgElement.nativeElement, this.container);
    this.renderer.appendChild(this.container, this.polygon);

    this.preview = this.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.renderer.appendChild(this.svgElement.nativeElement, this.preview);
  }

  drawPolygon(x1: number, x2: number, y1: number, y2: number, nbOfPoints: number): void {
    this.nbOfPoints = nbOfPoints;
    this.properties.width = Math.abs(x2 - x1);
    this.properties.height = Math.abs(y2 - y1);

    this.radius = Math.min(this.properties.width / 2.0, this.properties.height / 2.0);
    const centerX: number = (x1 + x2) / 2.0;
    const centerY: number = (y1 + y2) / 2.0;

    for (let i = 0; i < this.nbOfPoints; i++) {
      this.points.push(centerX - this.radius * Math.sin(2 * Math.PI * i / this.nbOfPoints));
      this.points.push(centerY - this.radius * Math.cos(2 * Math.PI * i / this.nbOfPoints));
    }

    const x: number = Math.min(x1, x2);
    const y: number = Math.min(y1, y2);
    this.previewAttributes(x, y, this.properties.width, this.properties.height);
    this.polygonAttributes();
  }

  private previewAttributes(x: number, y: number, width: number, height: number): void {
    this.renderer.setAttribute(this.preview, SvgAttributes.X, (x - this.properties.strokeWidth / 2).toString());
    this.renderer.setAttribute(this.preview, SvgAttributes.Y, (y - this.properties.strokeWidth / 2).toString());
    this.renderer.setAttribute(this.preview, SvgAttributes.WIDTH, Math.abs(width + this.properties.strokeWidth).toString());
    this.renderer.setAttribute(this.preview, SvgAttributes.HEIGHT, Math.abs(height + this.properties.strokeWidth).toString());
    this.renderer.setAttribute(this.preview, SvgAttributes.STROKE_WIDTH, PREVIEW_STROKE_WIDTH);
    this.renderer.setAttribute(this.preview, SvgAttributes.STROKE_DASHARRAY, PREVIEW_STROKE_DASHARRAY);
    this.renderer.setAttribute(this.preview, SvgAttributes.STROKE, BLACK);
    this.renderer.setAttribute(this.preview, SvgAttributes.FILL, NONE);
  }

  private polygonAttributes(): void {
    this.renderer.setAttribute(this.polygon, SvgAttributes.STROKE_WIDTH, (this.properties.strokeWidth).toString());
    this.traceType();
    this.renderer.setAttribute(this.polygon, SvgAttributes.POINTS, this.points.join(','));
    this.points = [];
  }

  private traceType(): void {
    switch (this.properties.type) {
      case TraceType.FILL:
        this.renderer.setAttribute(this.polygon, SvgAttributes.FILL, this.properties.primaryColor);
        this.renderer.setAttribute(this.polygon, SvgAttributes.STROKE, NONE);
        break;

      case TraceType.OUTLINE:
        this.renderer.setAttribute(this.polygon, SvgAttributes.FILL, NONE);
        this.renderer.setAttribute(this.polygon, SvgAttributes.STROKE, this.properties.secondaryColor);
        break;

      case TraceType.FILLOUTLINE:
        this.renderer.setAttribute(this.polygon, SvgAttributes.FILL, this.properties.primaryColor);
        this.renderer.setAttribute(this.polygon, SvgAttributes.STROKE, this.properties.secondaryColor);
        break;
    }
  }

  removePreview(): void {
    if (this.polygon) {
      this.renderer.removeChild(this.svgElement.nativeElement, this.preview);
      if (this.properties.height || this.properties.width) {
        this.drawingService.fillDrawingArray(this.container);
      } else {
        this.renderer.removeChild(this.svgElement.nativeElement, this.polygon);
        this.renderer.removeChild(this.svgElement.nativeElement, this.container);
      }
    }
  }
}
