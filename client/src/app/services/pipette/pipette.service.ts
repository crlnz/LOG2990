/* tslint:disable one-variable-per-declaration*/
/*
  Auteur: Équipe 12
  Description: Ce service permet de créer un lien entre les événements de la souris et la couleur
 */
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SvgAttributes, SvgTypes } from '../../components/svg-attributes';
import { ColorService } from '../color/color.service';
import { PipetteProperties } from './pipette-properties';

const RIGHTCLICK = 2;
const LEFTCLICK = 0;
const BORDERWIDTH = 5;
const EMPTY_CHAIN = '';
const COMMA = ',';

@Injectable({
  providedIn: 'root',
})

export class PipetteService {
  private clickedObject: SVGElement;
  private properties: PipetteProperties = new PipetteProperties();

  constructor(public colorService: ColorService) {
    this.colorService.currentPrimaryColor.subscribe((primaryColor: string) => this.properties.primaryColor = primaryColor);
    this.colorService.currentSecondaryColor.subscribe((secondaryColor: string) => this.properties.secondaryColor = secondaryColor);
  }

  setToolbarWidth(width: number): void {
    this.properties.toolbarWidth = width;
  }

  setAmountScrolled(amountX: number, amountY: number): void {
    this.properties.amountScrolledX = amountX;
    this.properties.amountScrolledY = amountY;
  }

  getSvgColor(event: MouseEvent): void {
    this.properties.positionX = event.clientX - this.properties.toolbarWidth + this.properties.amountScrolledX - BORDERWIDTH;
    this.properties.positionY = event.clientY + this.properties.amountScrolledY - BORDERWIDTH;
    if (event.target instanceof SVGElement) {
      this.clickedObject = event.target;
      switch (this.clickedObject.tagName) {
        case SvgTypes.SVG:
          this.properties.color = this.clickedObject.style.backgroundColor || EMPTY_CHAIN;
          break;

        case SvgTypes.RECT:
          this.mousePosInRect();
          break;

        case SvgTypes.ELLIPSE:
          this.mousePosInEllipsis();
          break;

        case SvgTypes.POLYGON:
          this.mousePosInPolygon();
          break;

        default:
          this.properties.color = this.clickedObject.getAttribute(SvgAttributes.STROKE) || EMPTY_CHAIN;
          break;
      }

      if (event.button === LEFTCLICK) {
        this.colorService.sendPrimaryColor(this.properties.color);
        this.colorService.changePipetteState(false);
      } else if (event.button === RIGHTCLICK) {
        event.preventDefault();
        this.colorService.sendSecondaryColor(this.properties.color);
        this.colorService.changePipetteState(false);

      }
    }
  }

  private mousePosInRect(): void {
    const strokeWidth: number = parseFloat(this.clickedObject.getAttribute(SvgAttributes.STROKE_WIDTH) || EMPTY_CHAIN);
    const minX: number = parseFloat((this.clickedObject.getAttribute(SvgAttributes.X) || EMPTY_CHAIN)) + (strokeWidth / 2);
    const maxX: number = minX + parseFloat((this.clickedObject.getAttribute(SvgAttributes.WIDTH) || EMPTY_CHAIN)) - strokeWidth;
    const minY: number = parseFloat((this.clickedObject.getAttribute(SvgAttributes.Y) || EMPTY_CHAIN)) + (strokeWidth / 2);
    const maxY: number = minY + parseFloat((this.clickedObject.getAttribute(SvgAttributes.HEIGHT) || EMPTY_CHAIN)) - strokeWidth;

    const posSmallerThanMinX: boolean = this.properties.positionX < minX;
    const posBiggerThanMaxX: boolean = this.properties.positionX > maxX;
    const posSmallerThanMinY: boolean = this.properties.positionY < minY;
    const posBiggerThanMaxY: boolean = this.properties.positionY > maxY;

    const position: boolean = (posSmallerThanMinX || posBiggerThanMaxX || posSmallerThanMinY || posBiggerThanMaxY);
    this.properties.color = position ?
      this.clickedObject.getAttribute(SvgAttributes.STROKE) || EMPTY_CHAIN :
      this.clickedObject.getAttribute(SvgAttributes.FILL) || EMPTY_CHAIN;
  }

  private mousePosInEllipsis(): void {
    const cx = parseFloat((this.clickedObject.getAttribute(SvgAttributes.CX) || EMPTY_CHAIN));
    const cy = parseFloat((this.clickedObject.getAttribute(SvgAttributes.CY) || EMPTY_CHAIN));

    const rx = parseFloat((this.clickedObject.getAttribute(SvgAttributes.RX) || EMPTY_CHAIN));
    const ry = parseFloat((this.clickedObject.getAttribute(SvgAttributes.RY) || EMPTY_CHAIN));

    const width = parseFloat(this.clickedObject.getAttribute(SvgAttributes.STROKE_WIDTH) || EMPTY_CHAIN);

    const rangeX: number = (Math.pow(this.properties.positionX - cx, 2) / Math.pow(rx - (width / 2), 2));
    const rangeY: number = (Math.pow(this.properties.positionY - cy, 2) / Math.pow(ry - (width / 2), 2));
    const ellipseRange: number = rangeX + rangeY;

    this.properties.color = (ellipseRange <= 1) ?
      this.clickedObject.getAttribute(SvgAttributes.FILL) || EMPTY_CHAIN :
      this.clickedObject.getAttribute(SvgAttributes.STROKE) || EMPTY_CHAIN;
  }

  private mousePosInPolygon(): void {
    const points: string[] = (this.clickedObject.getAttribute(SvgAttributes.POINTS) || EMPTY_CHAIN).split(COMMA);
    const x: number[] = new Array();
    const y: number[] = new Array();

    for (let i = 0; i < points.length; i++) {
      i % 2 === 0 ? x.push(parseFloat(points[i])) : y.push(parseFloat(points[i]));
    }

    this.findPolygonCenter(x, y);

    const nbOfPoints: number = x.length;
    const strokeWidth = parseFloat((this.clickedObject.getAttribute(SvgAttributes.STROKE_WIDTH) || EMPTY_CHAIN));
    this.properties.ajustedPointsX = [];
    this.properties.ajustedPointsY = [];

    this.ajustPoints(x, y, strokeWidth);

    const onFill = this.isOnFill(nbOfPoints);
    this.properties.color = onFill ?
      this.clickedObject.getAttribute(SvgAttributes.FILL) || EMPTY_CHAIN :
      this.clickedObject.getAttribute(SvgAttributes.STROKE) || EMPTY_CHAIN;
  }

  private isOnFill(nbOfPoints: number): boolean {
    let onFill = false;

    for (let i = 0, j = nbOfPoints - 1; i < nbOfPoints; j = i++) {
      const ajustedPointVsPosYEnI = this.properties.ajustedPointsY[i] >= this.properties.positionY;
      const ajustedPointVsPosYEnJ = this.properties.ajustedPointsY[j] >= this.properties.positionY;
      const ajustedVsPosY = (ajustedPointVsPosYEnI !== ajustedPointVsPosYEnJ);

      const numerateur = (this.properties.ajustedPointsX[j] - this.properties.ajustedPointsX[i]) *
        (this.properties.positionY - this.properties.ajustedPointsY[i]);
      const dominateur = this.properties.ajustedPointsY[j] - this.properties.ajustedPointsY[i];
      const positionRelative = numerateur / dominateur + (this.properties.ajustedPointsX[i]);

      if (ajustedVsPosY && (this.properties.positionX < positionRelative)) {
        onFill = !onFill;
      }
    }
    return onFill;
  }

  private findPolygonCenter(x: number[], y: number[]): void {
    let sommeX = 0;
    let sommeY = 0;

    for (let i = 0; i < x.length; i++) {
      sommeX += x[i];
      sommeY += y[i];
    }
    this.properties.centerX = sommeX / x.length;
    this.properties.centerY = sommeY / y.length;
  }

  private ajustPoints(x: number[], y: number[], strokeWidth: number): void {
    for (let k = 0; k < x.length; k++) {
      const distX = this.properties.centerX - (Math.round(10 * x[k]) / 10);
      const distY = this.properties.centerY - (Math.round(10 * y[k]) / 10);
      const length = Math.sqrt(distX * distX + distY * distY);
      x[k] = x[k] + distX * (strokeWidth / length);
      y[k] = y[k] + distY * (strokeWidth / length);
      this.properties.ajustedPointsX.push(x[k]);
      this.properties.ajustedPointsY.push(y[k]);
    }
  }
}
