/*  Auteur: Équipe 12
    Description: Cette composante gère l'outils crayon.
*/
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { SvgAttributes, SvgTypes } from '../../svg-attributes';
import { DrawingToolProperties } from '../drawing-tool-properties';

const SPACE = ' ';
const NONE = 'none';
const LINECAP_TYPE = 'round';
const EMPTY_STRING = '';
const RADIUS_FACTOR = 2;

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss'],
})

export class PencilComponent {
  private path: SVGElement;
  private point: SVGElement;
  private properties: DrawingToolProperties;
  private container: SVGElement;

  constructor(private renderer: Renderer2, private svgElement: ElementRef, private drawingService: DrawingService) {}

  createPath(x: number, y: number, width: number, primaryColor: string): void {
    const pathString = EMPTY_STRING;
    this.properties = {pathString, primaryColor, width};
    const rayon: number = this.properties.width / RADIUS_FACTOR;

    this.path = this.renderer.createElement(SvgTypes.PATH, SvgTypes.SVG_LINK);
    this.point = this.renderer.createElement(SvgTypes.CIRCLE, SvgTypes.SVG_LINK);
    this.container = this.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);

    this.properties.pathString = SvgAttributes.M + SPACE + x.toString() + SPACE + y.toString() + SPACE;

    this.circleAttributes(x, y, rayon);
    this.renderer.appendChild(this.svgElement.nativeElement, this.container);
    this.renderer.appendChild(this.container, this.path);
  }

  drawPencil(x: number, y: number): void {
    this.renderer.removeChild(this.svgElement.nativeElement, this.point);

    this.properties.pathString += SvgAttributes.L + SPACE + x.toString() + SPACE + y.toString() + SPACE;
    this.pathAttributes();
  }

  private circleAttributes(x: number, y: number, rayon: number) {
    this.renderer.setAttribute(this.point, SvgAttributes.CX, x.toString());
    this.renderer.setAttribute(this.point, SvgAttributes.CY, y.toString());
    this.renderer.setAttribute(this.point, SvgAttributes.R, rayon.toString());
    this.renderer.setAttribute(this.point, SvgAttributes.FILL, this.properties.primaryColor);

    this.renderer.appendChild(this.container, this.point);
  }

  private pathAttributes() {
    this.renderer.setAttribute(this.path, SvgAttributes.D, this.properties.pathString);
    this.renderer.setAttribute(this.path, SvgAttributes.FILL, NONE);
    this.renderer.setAttribute(this.path, SvgAttributes.STROKE_WIDTH, this.properties.width.toString());
    this.renderer.setAttribute(this.path, SvgAttributes.STROKE_LINECAP, LINECAP_TYPE);
    this.renderer.setAttribute(this.path, SvgAttributes.STROKE, this.properties.primaryColor);
  }

  removeNull(): void {
    if (this.path && this.point) {
      this.drawingService.fillDrawingArray(this.container);
    }

}
}
