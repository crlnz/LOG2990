/*
  Auteur: Équipe 12
  Description: Ce service permet de définir les couleurs choisies par l'utilisateur
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DefaultDrawingTools } from './drawing-tools-enum';

@Injectable({
  providedIn: 'root',
})

export class DrawingToolService {
  strokeWidth: number;
  maxTip: number;
  minTip: number;
  selectedTool: string;
  texture: string;
  pattern: string;
  diameter: number;
  displayPoint: boolean;
  junction: string;
  emission: number;

  private angle: BehaviorSubject<number> = new BehaviorSubject(0);
  currentAngle: Observable<number> = this.angle.asObservable();

  private tool: BehaviorSubject<string> = new BehaviorSubject(DefaultDrawingTools.TOOL.toString());
  currentTool: Observable<string> = this.tool.asObservable();

  constructor() {
    this.strokeWidth = DefaultDrawingTools.STROKEWIDTH;
    this.texture = DefaultDrawingTools.TEXTURE;
    this.diameter = DefaultDrawingTools.DIAMETER;
    this.pattern = DefaultDrawingTools.PATTERN;
    this.junction = DefaultDrawingTools.JUNCTION;
    this.displayPoint = false;
    this.maxTip = DefaultDrawingTools.MAX_TIP;
    this.minTip = DefaultDrawingTools.MIN_TIP;
    this.emission = DefaultDrawingTools.EMISSION;
  }

  sendTool(tool: string): void {
    this.selectedTool = tool;
    this.tool.next(tool);
  }

  updateAngle(angle: number) {
    this.angle.next(angle);
  }
}
