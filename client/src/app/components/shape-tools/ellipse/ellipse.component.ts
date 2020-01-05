/*  Auteur: Équipe 12
    Description: Cette composante gère l'outils ellipse.
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
  selector: 'app-ellipse',
  templateUrl: './ellipse.component.html',
  styleUrls: ['./ellipse.component.scss'],
})

export class EllipseComponent {
  private ellipse: SVGElement;
  private preview: SVGElement;
  private properties: ShapeProperties;

  private xInitCenter: number;
  private yInitCenter: number;
  private xFinalCenter: number;
  private yFinalCenter: number;
  private container: SVGElement;

  constructor(private renderer: Renderer2, private svgElement: ElementRef, private drawingService: DrawingService) {}

  createEllipse(primaryColor: string, secondaryColor: string, strokeWidth: number, type: string): void {
    this.properties = { strokeWidth, secondaryColor, primaryColor, type };
    this.container = this.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);

    this.ellipse = this.renderer.createElement(SvgTypes.ELLIPSE, SvgTypes.SVG_LINK);
    this.renderer.appendChild(this.svgElement.nativeElement, this.container);
    this.renderer.appendChild(this.container, this.ellipse);

    this.preview = this.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.renderer.appendChild(this.svgElement.nativeElement, this.preview);
  }

  drawEllipse(x1: number, x2: number, y1: number, y2: number, event: MouseEvent): void {
    if (event.shiftKey) {
      const delta: number = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
      x2 = x1 + (Math.sign(x2 - x1) || 1) * delta;
      y2 = y1 + (Math.sign(y2 - y1) || 1) * delta;
    }

    this.properties.width = Math.abs(x2 - x1) / 2;
    this.properties.height = Math.abs(y2 - y1) / 2;

    this.xInitCenter = Math.abs(x1 + this.properties.width);
    this.yInitCenter = Math.abs(y1 + this.properties.height);

    this.xFinalCenter = Math.abs(x2 + this.properties.width);
    this.yFinalCenter = Math.abs(y2 + this.properties.height);

    const x: number = Math.min(this.xInitCenter, this.xFinalCenter);
    const y: number = Math.min(this.yInitCenter, this.yFinalCenter);

    const previewX: number = Math.min(x1, x2);
    const previewY: number = Math.min(y1, y2);

    this.ellipseAttribute(x, y, this.properties.width, this.properties.height);
    this.previewAttributes(previewX, previewY, this.properties.width, this.properties.height);
  }

  private previewAttributes(previewX: number, previewY: number, width: number, height: number): void {
    this.renderer.setAttribute(this.preview, SvgAttributes.X, (previewX - this.properties.strokeWidth / 2).toString());
    this.renderer.setAttribute(this.preview, SvgAttributes.Y, (previewY - this.properties.strokeWidth / 2).toString());
    this.renderer.setAttribute(this.preview, SvgAttributes.WIDTH, ((width + this.properties.strokeWidth / 2) * 2).toString());
    this.renderer.setAttribute(this.preview, SvgAttributes.HEIGHT, ((height + this.properties.strokeWidth / 2) * 2).toString());
    this.renderer.setAttribute(this.preview, SvgAttributes.STROKE_WIDTH, PREVIEW_STROKE_WIDTH);
    this.renderer.setAttribute(this.preview, SvgAttributes.STROKE_DASHARRAY, PREVIEW_STROKE_DASHARRAY);
    this.renderer.setAttribute(this.preview, SvgAttributes.STROKE, BLACK);
    this.renderer.setAttribute(this.preview, SvgAttributes.FILL, NONE);
  }

  private ellipseAttribute(x: number, y: number, width: number, height: number): void {
    this.renderer.setAttribute(this.ellipse, SvgAttributes.RX, width.toString());
    this.renderer.setAttribute(this.ellipse, SvgAttributes.RY, height.toString());

    this.renderer.setAttribute(this.ellipse, SvgAttributes.CX, x.toString());
    this.renderer.setAttribute(this.ellipse, SvgAttributes.CY, y.toString());

    this.renderer.setAttribute(this.ellipse, SvgAttributes.STROKE_WIDTH, (this.properties.strokeWidth).toString());
    this.traceType();
  }

  private traceType(): void {
    switch (this.properties.type) {
      case TraceType.FILL:
        this.renderer.setAttribute(this.ellipse, SvgAttributes.FILL, this.properties.primaryColor);
        this.renderer.setAttribute(this.ellipse, SvgAttributes.STROKE, NONE);
        break;

      case TraceType.OUTLINE:
        this.renderer.setAttribute(this.ellipse, SvgAttributes.FILL, NONE);
        this.renderer.setAttribute(this.ellipse, SvgAttributes.STROKE, this.properties.secondaryColor);
        break;

      case TraceType.FILLOUTLINE:
        this.renderer.setAttribute(this.ellipse, SvgAttributes.FILL, this.properties.primaryColor);
        this.renderer.setAttribute(this.ellipse, SvgAttributes.STROKE, this.properties.secondaryColor);
        break;
    }
  }

  removePreview(): void {
    if (this.ellipse) {
      this.renderer.removeChild(this.svgElement.nativeElement, this.preview);
      if (this.properties.height || this.properties.width) {
        this.drawingService.fillDrawingArray(this.container);
      } else {
        this.renderer.removeChild(this.svgElement.nativeElement, this.ellipse);
        this.renderer.removeChild(this.svgElement.nativeElement, this.container);
      }
    }
  }
}
