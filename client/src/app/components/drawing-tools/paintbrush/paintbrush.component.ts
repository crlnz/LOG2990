/*  Auteur: Équipe 12
    Description: Cette composante gère l'outils pinceau.
*/
import { Component, ElementRef, Renderer2} from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { SvgAttributes, SvgTypes } from '../../svg-attributes';
import { DrawingToolProperties } from '../drawing-tool-properties';

const SPACE = ' ';
const EMPTY_STRING = '';
const NONE = 'none';
const LINECAP_TYPE = 'round';
const RADIUS_FACTOR = 2;
const POUND = '#';
const OPEN_PARENTHESIS = '(';
const CLOSE_PARENTHESIS = ')';

@Component({
  selector: 'app-paintbrush',
  templateUrl: './paintbrush.component.html',
  styleUrls: ['./paintbrush.component.scss'],
})

export class PaintbrushComponent {
  private path: SVGElement;
  private point: SVGElement;
  private properties: DrawingToolProperties;
  private container: SVGElement;
  private texture: string;

  constructor(private renderer: Renderer2, private svgElement: ElementRef, private drawingService: DrawingService) {}

  createPaintbrush(x: number, y: number, primaryColor: string, width: number, texture: string): void {
    const pathString = EMPTY_STRING;
    this.properties = {pathString, primaryColor, width};
    this.texture = texture;
    const rayon: number = this.properties.width / RADIUS_FACTOR;

    this.path = this.renderer.createElement(SvgTypes.PATH, SvgTypes.SVG_LINK);
    this.point = this.renderer.createElement(SvgTypes.CIRCLE, SvgTypes.SVG_LINK);
    this.container = this.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);

    this.properties.pathString = SvgAttributes.M + SPACE + x.toString() + SPACE + y.toString() + SPACE;

    this.circleAttributes(x, y, rayon);
    this.renderer.appendChild(this.svgElement.nativeElement, this.container);
    this.renderer.appendChild(this.container, this.path);
  }

  drawPaintbrush(x: number, y: number): void {
    this.renderer.removeChild(this.svgElement.nativeElement, this.point);
    this.properties.pathString += SvgAttributes.L + SPACE + x.toString() + SPACE + y.toString() + SPACE;
    this.pathAttributes();
  }

  private circleAttributes(x: number, y: number, rayon: number) {
    this.renderer.setAttribute(this.point, SvgAttributes.CX, x.toString());
    this.renderer.setAttribute(this.point, SvgAttributes.CY, y.toString());
    this.renderer.setAttribute(this.point, SvgAttributes.R, rayon.toString());
    this.renderer.setAttribute(this.point, SvgAttributes.FILL, this.properties.primaryColor);
    this.renderer.setAttribute(this.point, SvgAttributes.FILTER, SvgAttributes.URL + OPEN_PARENTHESIS + POUND +
                              this.texture + CLOSE_PARENTHESIS);

    this.renderer.appendChild(this.svgElement.nativeElement, this.point);
  }

  private pathAttributes() {
    this.renderer.setAttribute(this.path, SvgAttributes.D, this.properties.pathString);
    this.renderer.setAttribute(this.path, SvgAttributes.STROKE_WIDTH, this.properties.width.toString());
    this.renderer.setAttribute(this.path, SvgAttributes.FILL, NONE);
    this.renderer.setAttribute(this.path, SvgAttributes.STROKE, this.properties.primaryColor);
    this.renderer.setAttribute(this.path, SvgAttributes.FILTER, SvgAttributes.URL + OPEN_PARENTHESIS + POUND +
                              this.texture + CLOSE_PARENTHESIS);

    this.renderer.setAttribute(this.path, SvgAttributes.STROKE_LINECAP, LINECAP_TYPE);
  }

  removeNull(): void {
    if (this.path && this.point) {
      this.drawingService.fillDrawingArray(this.container);
    }
  }
}
