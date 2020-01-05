import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DrawingToolService } from 'src/app/services/drawing-tools/drawing-tools.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { SvgAttributes, SvgTypes } from '../../svg-attributes';
import { DrawingToolProperties } from '../drawing-tool-properties';
import { FeatherProperties } from './feather-properties';

const SPACE = ' ';
const EMPTY_STRING = '';
const DEFAULT_STROKE_WIDTH = '1';
const COMMA = ',';
const COLOR_LENGTH_WITH_TRANSPARENCY = 9;
const TRANSPARENCY_LENGTH = 2;
const PERCENTAGE_FACTOR = 100;
const RIGHT_ANGLE = 90;
const FIND_RADIUS = 2;

@Component({
  selector: 'app-feather',
  templateUrl: './feather.component.html',
  styleUrls: ['./feather.component.scss'],
})

export class FeatherComponent {
  private container: SVGElement;
  private path: SVGElement;
  private segment: SVGElement;
  private properties: DrawingToolProperties;
  private featherProperties: FeatherProperties = new FeatherProperties();
  private opacity: number;

  constructor(private renderer: Renderer2, private svgElement: ElementRef, private drawingService: DrawingService,
              private drawingToolsService: DrawingToolService) {}

  createPath(x: number, y: number, width: number, primaryColor: string, opacity: number): void {
    this.drawingToolsService.currentAngle.subscribe((angle: number) => this.featherProperties.angle = angle);
    this.opacity = opacity / PERCENTAGE_FACTOR;
    this.properties = {pathString: EMPTY_STRING, primaryColor, width};
    this.splitColorString();
    this.createContainer();
    this.createSegment();

    this.findCoordinates(this.featherProperties.angle, x, y);
    this.updateLeftCoordinates();
    this.updateSegment();
  }

  drawFeather(x: number, y: number): void {
    this.updateLeftCoordinates();
    this.createSegment();
    this.findCoordinates(this.featherProperties.angle, x, y);
    this.updateSegment();
  }

  removeNull(): void {
    this.drawingToolsService.currentAngle.subscribe((angle: number) => this.featherProperties.angle = angle);
    if (this.container) {
      this.drawingService.fillDrawingArray(this.container);
    }
  }

  private splitColorString(): void {
    if (this.properties.primaryColor.length === COLOR_LENGTH_WITH_TRANSPARENCY) {
      this.properties.primaryColor = this.properties.primaryColor.substring(0,
                                     this.properties.primaryColor.length - TRANSPARENCY_LENGTH);
    }
  }

  private createContainer(): void {
    this.container = this.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);
    this.path = this.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);
    this.renderer.appendChild(this.svgElement.nativeElement, this.container);
    this.renderer.appendChild(this.container, this.path);
  }

  private createSegment(): void {
    this.segment = this.renderer.createElement(SvgTypes.POLYGON, SvgTypes.SVG_LINK);
    this.segmentAttributes();
  }

  private toRadian(angle: number): number {
    const FIND_ANGLE_IN_DEG = 180;
    return angle * (Math.PI / FIND_ANGLE_IN_DEG);
  }

  private findCoordinates(angle: number, x: number, y: number): void {
    const angleRad = this.toRadian(this.featherProperties.angle);
    const radius = this.properties.width / FIND_RADIUS;
    const opposite = radius * Math.cos(angleRad);
    const adjacent = radius * Math.sin(angleRad);
    if (angle === RIGHT_ANGLE) {
      this.updateRightCoordinates(x, y - radius, x, y + radius);
    } else {
      this.updateRightCoordinates(x + opposite, y - adjacent, x - opposite, y + adjacent);
    }
  }

  private updateRightCoordinates(newTopX: number, newTopY: number, newBottomX: number, newBottomY: number): void {
    this.featherProperties.topRightX = newTopX;
    this.featherProperties.topRightY = newTopY;
    this.featherProperties.bottomRightX = newBottomX;
    this.featherProperties.bottomRightY = newBottomY;
  }

  private updateSegment(): void {
    this.properties.pathString = this.featherProperties.topLeftX + COMMA + this.featherProperties.topLeftY
    + SPACE + this.featherProperties.topRightX + COMMA + this.featherProperties.topRightY
    + SPACE + this.featherProperties.bottomRightX + COMMA + this.featherProperties.bottomRightY
    + SPACE + this.featherProperties.bottomLeftX + COMMA + this.featherProperties.bottomLeftY;
    this.renderer.setAttribute(this.segment, SvgAttributes.POINTS, this.properties.pathString);
    this.renderer.appendChild(this.path, this.segment);
  }

  private updateLeftCoordinates(): void {
    this.featherProperties.topLeftX = this.featherProperties.topRightX;
    this.featherProperties.topLeftY = this.featherProperties.topRightY;
    this.featherProperties.bottomLeftX = this.featherProperties.bottomRightX;
    this.featherProperties.bottomLeftY = this.featherProperties.bottomRightY;
  }

  private segmentAttributes(): void {
    this.renderer.setAttribute(this.segment, SvgAttributes.FILL, this.properties.primaryColor);
    this.renderer.setAttribute(this.segment, SvgAttributes.STROKE_WIDTH, DEFAULT_STROKE_WIDTH);
    this.renderer.setAttribute(this.segment, SvgAttributes.STROKE, this.properties.primaryColor);
    this.renderer.setAttribute(this.container, SvgAttributes.OPACITY, this.opacity.toString());
  }
}
