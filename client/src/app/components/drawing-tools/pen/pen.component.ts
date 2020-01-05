import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { SvgAttributes, SvgTypes } from '../../svg-attributes';
import { DrawingToolProperties } from '../drawing-tool-properties';
import { PenProperties } from './pen-properties';

const SPACE = ' ';
const NONE = 'none';
const LINECAP_TYPE = 'round';
const LINEJOIN_TYPE = 'round';
const RADIUS_FACTOR = 2;
const TRANSFORM_TO_PERCENTAGE = 100;
const INITIAL_TIME = 0;
const MULTIPLICATION_FACTOR = 1;
const MINIMAL_DIFFERENCE = 0.05;
const COLOR_LENGTH_WITH_TRANSPARENCY = 9;
const TRANSPARENCY_LENGTH = 2;

@Component({
  selector: 'app-pen',
  templateUrl: './pen.component.html',
  styleUrls: ['./pen.component.scss'],
})

export class PenComponent {
  private segments: SVGElement;
  private path: SVGElement;
  private point: SVGElement;
  private properties: DrawingToolProperties;
  private penProperties: PenProperties = new PenProperties();
  private initialPoint = true;
  private opacity: number;
  private container: SVGElement;
  constructor(private renderer: Renderer2, private svgElement: ElementRef, private drawingService: DrawingService) {}

  drawPen(x: number, y: number): void {
    if (this.initialPoint) {
      this.renderer.removeChild(this.svgElement.nativeElement, this.point);
      this.initialPoint = false;
    }
    this.calculateMouseSpeed(x, y);
    this.calculateTipSizeWithSpeed();
    this.smoothSegments();

    this.properties.pathString += SvgAttributes.L + SPACE + x.toString() + SPACE + y.toString() + SPACE;
    this.renderer.setAttribute(this.segments, SvgAttributes.D, this.properties.pathString);
    this.renderer.setAttribute(this.segments, SvgAttributes.STROKE_WIDTH, this.penProperties.currentTipWithSpeed.toString());

    this.createNewSegment(x, y);
    this.renderer.appendChild(this.path, this.segments);
    this.penProperties.previousTipWithSpeed = this.penProperties.currentTipWithSpeed;
  }

  private calculateTipSizeWithSpeed() {
    this.penProperties.currentTipWithSpeed = this.penProperties.maxTip - (Math.max(Math.abs(this.penProperties.speedX),
        Math.abs(this.penProperties.speedY)) / 12);
  }

  private createNewSegment(x: number, y: number) {
    this.segments = this.renderer.createElement(SvgTypes.PATH, SvgTypes.SVG_LINK);
    this.properties.pathString = SvgAttributes.M + SPACE + x.toString() + SPACE + y.toString() + SPACE;
    this.renderer.setAttribute(this.segments, SvgAttributes.D, this.properties.pathString);
    this.attributePath();
  }

  createPath(x: number, y: number, primaryColor: string, maxTip: number, minTip: number, opacity: number): void {
    this.opacity = opacity / 100;
    this.penProperties.maxTip = maxTip;
    this.penProperties.minTip = minTip;
    this.properties = {pathString: '', primaryColor, width: 0};
    const rayon: number = (minTip / 2) / RADIUS_FACTOR;
    this.splitColorString();

    this.container = this.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);
    this.path = this.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);
    this.point = this.renderer.createElement(SvgTypes.CIRCLE, SvgTypes.SVG_LINK);

    this.createNewSegment(x, y);
    this.setAttributesPoint(x, y, rayon);
    this.renderer.appendChild(this.svgElement.nativeElement, this.container);
    this.renderer.appendChild(this.container, this.path);
    this.renderer.appendChild(this.path, this.point);

  }

  private splitColorString(): void {
    if (this.properties.primaryColor.length === COLOR_LENGTH_WITH_TRANSPARENCY) {
      this.properties.primaryColor = this.properties.primaryColor.substring(0,
                                     this.properties.primaryColor.length - TRANSPARENCY_LENGTH);
    }
  }

  private setAttributesPoint(x: number, y: number, rayon: number) {
    this.renderer.setAttribute(this.point, SvgAttributes.CX, x.toString());
    this.renderer.setAttribute(this.point, SvgAttributes.CY, y.toString());
    this.renderer.setAttribute(this.point, SvgAttributes.R, rayon.toString());
    this.renderer.setAttribute(this.point, SvgAttributes.FILL, this.properties.primaryColor);
    this.renderer.setAttribute(this.point, SvgAttributes.OPACITY, this.opacity.toString());
  }

  private attributePath() {
    this.renderer.setAttribute(this.segments, SvgAttributes.FILL, NONE);
    this.renderer.setAttribute(this.segments, SvgAttributes.STROKE_LINECAP, LINECAP_TYPE);
    this.renderer.setAttribute(this.segments, SvgAttributes.STROKE_LINEJOIN, LINEJOIN_TYPE);
    this.renderer.setAttribute(this.segments, SvgAttributes.STROKE, this.properties.primaryColor);
    this.renderer.setAttribute(this.segments, SvgAttributes.STROKE_WIDTH, (this.penProperties.maxTip).toString());
    this.renderer.setAttribute(this.path, SvgAttributes.OPACITY, this.opacity.toString());
  }

  removeNull(): void {
    this.penProperties.previousTipWithSpeed = this.penProperties.maxTip;
    if (this.path && this.point) {
      this.drawingService.fillDrawingArray(this.container);
    }
  }

  private calculateMouseSpeed(x: number, y: number) {
    let differenceX: number;
    let differenceY: number;
    let timeDifference: number;
    let currentTime: number;

    if (this.penProperties.previousTime === INITIAL_TIME) {
      this.penProperties.previousTime = Date.now();
      this.penProperties.previousX = x;
      this.penProperties.previousY = y;
    }
    currentTime = Date.now();

    timeDifference = currentTime - this.penProperties.previousTime;
    differenceX = x - this.penProperties.previousX;
    differenceY = y - this.penProperties.previousY;

    this.penProperties.speedX = Math.round(differenceX / timeDifference * TRANSFORM_TO_PERCENTAGE);
    this.penProperties.speedY = Math.round(differenceY / timeDifference * TRANSFORM_TO_PERCENTAGE);

    this.penProperties.previousTime = currentTime;
    this.penProperties.previousX = x;
    this.penProperties.previousY = y;
  }

  private smoothSegments() {
    const tipWithSpeedDifference = this.penProperties.previousTipWithSpeed - this.penProperties.currentTipWithSpeed;
    let tempTipWithSpeed: number;
    if (tipWithSpeedDifference >= MINIMAL_DIFFERENCE) {
      tempTipWithSpeed = this.penProperties.previousTipWithSpeed * (MULTIPLICATION_FACTOR - MINIMAL_DIFFERENCE);
      this.penProperties.currentTipWithSpeed = (tempTipWithSpeed >= this.penProperties.minTip) ?
                                                tempTipWithSpeed : this.penProperties.minTip;
    }

    if (tipWithSpeedDifference < MINIMAL_DIFFERENCE) {
      tempTipWithSpeed = this.penProperties.previousTipWithSpeed * (MULTIPLICATION_FACTOR + MINIMAL_DIFFERENCE);
      this.penProperties.currentTipWithSpeed = (tempTipWithSpeed <= this.penProperties.maxTip) ?
                                                tempTipWithSpeed : this.penProperties.maxTip;
    }
  }
}
