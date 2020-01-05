/*
  Auteur: Équipe 12
  Description: Ce service permet de définir les attributs de la forme que l'utilisateur a choisi
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShapeDefault } from './shape-enum';

@Injectable({
  providedIn: 'root',
})

export class ShapeService {
  strokeWidth: number;
  shape: string;
  type: string;
  nbPoints: number;

  private tool: BehaviorSubject<string> = new BehaviorSubject(ShapeDefault.SHAPE.toString());
  currentTool: Observable<string> = this.tool.asObservable();

  constructor() {
    this.strokeWidth = ShapeDefault.STROKEWIDTH;
    this.type = ShapeDefault.TYPE;
    this.nbPoints = ShapeDefault.NB_POINTS;
  }

  sendTool(tool: string): void {
    this.shape = tool;
    this.tool.next(tool);
  }
}
