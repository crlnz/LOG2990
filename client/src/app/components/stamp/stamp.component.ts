/*  Auteur: Équipe 12
    Description: Cette composante gère l'outils étampe.
*/
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { StampService } from 'src/app/services/stamp/stamp.service';
import { SvgAttributes, SvgTypes } from '../svg-attributes';

const OPEN_PARENTHESIS = '(';
const CLOSE_PARENTHESIS = ')';
const SPACE = ' ';
const COMMA = ',';
const IMAGE_PATH = '../../../assets/Stamps/';
const FILE_EXTENSION = '.png';
const NULL = 'null';
const CANVAS_CONTEXT = '2d';
const CANVAS = 'canvas';
const DEFAULT_IMAGE_SIZE = 100;
const FACTOR_MIDDLE = 2;
const ZERO = 0;

@Component({
  selector: 'app-stamp',
  templateUrl: './stamp.component.html',
  styleUrls: ['./stamp.component.scss'],
})
export class StampComponent {
  private image: CanvasImageSource;
  private container: SVGElement;

  constructor(private renderer: Renderer2, private svgElement: ElementRef, private drawingService: DrawingService,
              private stampService: StampService) { }

  createPath(x: number, y: number, scale: number, stamp: string): void {
    let rotation: number = ZERO;
    this.stampService.currentRotation.subscribe((rotate: number) => rotation = rotate);
    const width: number = DEFAULT_IMAGE_SIZE * scale;
    const height: number = DEFAULT_IMAGE_SIZE * scale;
    const middleW: number = width / FACTOR_MIDDLE;
    const middleH: number = height / FACTOR_MIDDLE;
    if (stamp !== NULL) {
      this.container = this.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);
      this.image = this.renderer.createElement(SvgTypes.IMAGE, SvgTypes.SVG_LINK);
      this.stampAttributes(x, y, stamp, rotation, width, height, middleW, middleH);
      this.drawingService.fillDrawingArray(this.container as SVGElement);
    }
  }

  private stampAttributes(x: number, y: number, stamp: string, rotate: number, width: number,
                          height: number, middleW: number, middleH: number) {
    this.renderer.setAttribute(this.image, SvgAttributes.X, (x - middleW).toString());
    this.renderer.setAttribute(this.image, SvgAttributes.Y, (y - middleH).toString());

    stamp += FILE_EXTENSION;
    this.renderer.setAttribute(this.image, SvgAttributes.HREF, IMAGE_PATH + stamp);

    this.renderer.setAttribute(this.image, SvgAttributes.WIDTH, width.toString());
    this.renderer.setAttribute(this.image, SvgAttributes.HEIGHT, height.toString());
    if (rotate !== 0) {
      this.renderer.setAttribute(this.image, SvgAttributes.TRANSFORM, SvgAttributes.TRANSLATE + OPEN_PARENTHESIS
        + ZERO + COMMA + ZERO + CLOSE_PARENTHESIS +  SvgAttributes.ROTATE + OPEN_PARENTHESIS
        + rotate + COMMA + x + COMMA + y + CLOSE_PARENTHESIS);
    }

    this.renderer.appendChild(this.svgElement.nativeElement, this.container);
    this.renderer.appendChild(this.container, this.image);
    this.convertToBase64(width, height);
  }

  private convertToBase64(width: number, height: number) {
    const canvas = this.renderer.createElement(CANVAS) as HTMLCanvasElement;
    canvas.height = height;
    canvas.width = width;
    const context: CanvasRenderingContext2D | null = canvas.getContext(CANVAS_CONTEXT);
    if (context != null) {
      context.drawImage(this.image, ZERO, ZERO, canvas.width, canvas.height);
      this.renderer.setAttribute(this.image, SvgAttributes.HREF, canvas.toDataURL());
    }
  }
}
