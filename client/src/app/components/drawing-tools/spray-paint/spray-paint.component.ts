import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { SPACE } from 'src/app/services/paintBucket/paint-bucket-properties';
import { SvgAttributes, SvgTypes } from '../../svg-attributes';
import { SprayPaintProperties } from './spray-paint-properties';

const COMMA = ',';
const M_ATTRIBUTE = ' m -';
const A_ATTRIBUTE = ',0 a ';
const R_ATTRIBUTE = ' 0 1,0 ';
const DASH = '-';
const ZERO = ',0';
const FIND_DIAMETER = 2;
const INTERVAL = 150;

@Component({
  selector: 'app-spray-paint',
  templateUrl: './spray-paint.component.html',
  styleUrls: ['./spray-paint.component.scss'],
})

export class SprayPaintComponent {
  private container: SVGElement;
  private path: SVGEllipseElement;
  private properties: SprayPaintProperties;

  private spray: number;
  private offset = [0, 0];
  private pathString: string;

  constructor(private renderer: Renderer2, private svgElement: ElementRef, private drawingService: DrawingService) {}

  createPoint(x: number, y: number, diameter: number, primaryColor: string, emission: number): void {
    this.properties = {primaryColor, diameter, x, y, emission};
    this.container = this.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);
    this.path = this.renderer.createElement(SvgTypes.PATH, SvgTypes.SVG_LINK);
    this.renderer.appendChild(this.svgElement.nativeElement, this.container);
    this.renderer.setAttribute(this.container, SvgAttributes.FILL, this.properties.primaryColor);

    this.pathString = SvgAttributes.M + x + COMMA + y;
    this.renderer.setAttribute(this.path, SvgAttributes.D, this.pathString);

    this.airBrush();
  }

  removeNull(): void {
    clearInterval(this.spray);
    if (this.container) {
      this.drawingService.fillDrawingArray(this.container);
    }
  }

  drawSprayPaint(x: number, y: number): void {
    this.properties.x = x;
    this.properties.y = y;
  }

  private airBrush(): void {
    const FIND_RADIUS = 2;
    const FIND_DENSITY = 0.1;
    const density = Math.ceil(this.properties.emission * FIND_DENSITY);
    const radius = this.properties.diameter / FIND_RADIUS;
    this.spray = window.setInterval(() => {
      for (let i = 0; i < density; i++) {
        this.offset = this.calculateRandomOffset(radius);
        this.pathString += this.convertToPath();
        this.renderer.setAttribute(this.path, SvgAttributes.D, this.pathString);
      }
      this.renderer.appendChild(this.container, this.path);
    }, INTERVAL);
  }

  private convertToPath(): string {
    const cx = this.properties.x + this.offset[0];
    const cy = this.properties.y + this.offset[1];
    const r = 1;
    const diameter = r * FIND_DIAMETER;
    return SvgAttributes.M + cx + SPACE + cy + M_ATTRIBUTE + r + A_ATTRIBUTE + r + COMMA + r + R_ATTRIBUTE
          + diameter + A_ATTRIBUTE + r + COMMA + r + R_ATTRIBUTE +  DASH + diameter + ZERO;
  }

  private calculateRandomOffset(radius: number): number[] {
    const FIND_RANDOM_ANGLE = 2;
    const randomAngle = Math.random() * (FIND_RANDOM_ANGLE * Math.PI);
    const randomRadius = Math.random() * radius;
    const x = Math.cos(randomAngle) * randomRadius;
    const y = Math.sin(randomAngle) * randomRadius;
    return [x, y];
  }
}
