/*  Auteur: Équipe 12
    Description: Cette composante gère le panel pour les outils de dessin.
*/
import { Component } from '@angular/core';
import { Tools } from 'src/app/services/tools/tool-properties';
import { DrawingToolService } from '../../../services/drawing-tools/drawing-tools.service';

const CONTINUOUS = 'Continuous';
const POINT = 'Point';
const DEFAULT_SPRAY_PAINT_WIDTH = 15;
const RESET_ANGLE = 0;

@Component({
  selector: 'app-attributes-drawing-tool',
  templateUrl: './attributes-drawing-tool.component.html',
  styleUrls: ['./attributes-drawing-tool.component.css'],
})
export class DrawingToolAttributesComponent {
  private width: number;
  private diameter: number;
  private selectedTool: string;
  private selectedTexture: string;
  private selectedPattern: string;
  private selectedJuntion: string;
  private continuous: boolean;
  private line: boolean;
  private paintbrush: boolean;
  private pen: boolean;
  private feather: boolean;
  private sprayPaint: boolean;
  private sprayPaintEnteredOnce: boolean;
  private displayPoint: boolean;
  private minWidth: number;
  private maxWidth: number;
  private emission: number;
  private angle: number;

  constructor(private drawingToolService: DrawingToolService) {
    this.drawingToolService.currentTool.subscribe((tool: string) => {
      this.selectedTool = tool;
      this.updateTool();
    });
    this.drawingToolService.currentAngle.subscribe ((angle: number) => this.angle = angle);
    this.drawingToolService.sendTool(this.selectedTool);
    this.width = this.drawingToolService.strokeWidth;
    this.selectedTexture = this.drawingToolService.texture;
    this.selectedPattern = this.drawingToolService.pattern;
    this.diameter = this.drawingToolService.diameter;
    this.selectedJuntion = this.drawingToolService.junction;
    this.minWidth = this.drawingToolService.minTip;
    this.maxWidth = this.drawingToolService.maxTip;
    this.emission = this.drawingToolService.emission;
  }

  private sendWidth(): void {
    this.drawingToolService.strokeWidth = this.width;
    this.continuous = (this.selectedPattern === CONTINUOUS && this.selectedTool === Tools.LINE);
  }

  private sendEmission(): void {
    this.drawingToolService.emission = this.emission;
  }

  private sendAngle(): void {
    this.drawingToolService.updateAngle(this.angle);
  }

  private sendMinPenWidth(): void {
    if (this.minWidth < this.maxWidth) {
      this.drawingToolService.minTip = this.minWidth;
    }
  }

  private sendMaxPenWidth(): void {
    if (this.maxWidth > this.minWidth) {
      this.drawingToolService.maxTip = this.maxWidth;
    }
  }

  private sendTool(): void {

    this.drawingToolService.sendTool(this.selectedTool);
    this.updateTool();
  }

  private sendTexture(): void {
    this.drawingToolService.texture = this.selectedTexture;
  }

  private sendDiameter(): void {
    this.drawingToolService.diameter = this.diameter;
  }

  private sendPattern(): void {
    this.continuous = (this.selectedPattern === CONTINUOUS && this.selectedTool === Tools.LINE);
    this.drawingToolService.pattern = this.selectedPattern;
  }

  private sendJunction(): void {
    this.drawingToolService.junction = this.selectedJuntion;
    this.displayPoint = (this.selectedJuntion === POINT);
    this.drawingToolService.displayPoint = this.displayPoint;
  }

  private updateTool(): void {
    if (this.selectedTool === Tools.FEATHER) {
      this.drawingToolService.updateAngle(RESET_ANGLE);
    }
    if (this.selectedTool === Tools.SPRAY_PAINT && !this.sprayPaintEnteredOnce) {
      this.width = DEFAULT_SPRAY_PAINT_WIDTH;
      this.drawingToolService.strokeWidth = this.width;
      this.sprayPaintEnteredOnce = true;
    }
    this.paintbrush = (this.selectedTool === Tools.PAINTBRUSH);
    this.pen = (this.selectedTool === Tools.PEN);
    this.line = (this.selectedTool === Tools.LINE);
    this.continuous = (this.selectedPattern === CONTINUOUS && this.selectedTool === Tools.LINE);
    this.sprayPaint = (this.selectedTool === Tools.SPRAY_PAINT);
    this.feather = (this.selectedTool === Tools.FEATHER);
  }
}
