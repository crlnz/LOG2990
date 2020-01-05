/*  Auteur: Équipe 12
    Description: Cette composante gère l'outils rectangle.
*/
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { SvgAttributes, SvgTypes } from '../../svg-attributes';
import { ShapeProperties, TraceType } from '../shape-properties';

const NONE = 'none';
@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss'],
})

export class RectangleComponent {
  private rect: SVGElement;
  private properties: ShapeProperties;
  private container: SVGElement;

  constructor(private renderer: Renderer2, private svgElement: ElementRef, private drawingService: DrawingService) {}

  createRectangle(primaryColor: string, secondaryColor: string, strokeWidth: number, type: string): void {
    this.properties = { strokeWidth, secondaryColor, primaryColor, type };
    this.container = this.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);
    this.rect = this.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.renderer.appendChild(this.svgElement.nativeElement, this.container);
    this.renderer.appendChild(this.container, this.rect);
  }

  drawRectangle(x1: number, x2: number, y1: number, y2: number, event: MouseEvent): void {
    if (event.shiftKey) {
      const delta: number = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
      x2 = x1 + (Math.sign(x2 - x1) || 1) * delta;
      y2 = y1 + (Math.sign(y2 - y1) || 1) * delta;
    }

    this.properties.width = Math.abs(x2 - x1);
    this.properties.height = Math.abs(y2 - y1);

    const x: number = Math.min(x1, x2);
    const y: number = Math.min(y1, y2);
    this.rectangleAttributes(x, y, this.properties.width, this.properties.height);
  }

  private rectangleAttributes(x: number, y: number, width: number, height: number): void {
    this.renderer.setAttribute(this.rect, SvgAttributes.X, (x).toString());
    this.renderer.setAttribute(this.rect, SvgAttributes.Y, (y).toString());
    this.renderer.setAttribute(this.rect, SvgAttributes.WIDTH, width.toString());
    this.renderer.setAttribute(this.rect, SvgAttributes.HEIGHT, height.toString());
    this.renderer.setAttribute(this.rect, SvgAttributes.STROKE_WIDTH, (this.properties.strokeWidth).toString());
    this.traceType();
  }

  private traceType(): void {
    switch (this.properties.type) {
      case TraceType.FILL:
        this.renderer.setAttribute(this.rect, SvgAttributes.FILL, this.properties.primaryColor);
        this.renderer.setAttribute(this.rect, SvgAttributes.STROKE, NONE);
        break;

      case TraceType.OUTLINE:
        this.renderer.setAttribute(this.rect, SvgAttributes.FILL, NONE);
        this.renderer.setAttribute(this.rect, SvgAttributes.STROKE, this.properties.secondaryColor);
        break;

      case TraceType.FILLOUTLINE:
        this.renderer.setAttribute(this.rect, SvgAttributes.FILL, this.properties.primaryColor);
        this.renderer.setAttribute(this.rect, SvgAttributes.STROKE, this.properties.secondaryColor);
        break;
    }
  }

  removeNull(): void {
    if (this.rect) {
      if (this.properties.height && this.properties.width) {
        this.drawingService.fillDrawingArray(this.container);
      } else {
        this.renderer.removeChild(this.svgElement.nativeElement, this.rect);
        this.renderer.removeChild(this.svgElement.nativeElement, this.container);
      }
    }
  }
}
